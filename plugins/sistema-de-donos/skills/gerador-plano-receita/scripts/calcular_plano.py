#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Calcula os números do Plano de Receita a partir do mesmo JSON do gerador da
planilha, sem depender de Excel, LibreOffice nem openpyxl (só Python 3).

Uso:
    python3 calcular_plano.py dados.json

Imprime em Markdown:
  - a tabela do plano (entradas, propostas, vendas, receita, ticket médio,
    conversões, receita por entrada, % da receita) por fonte e o total;
  - as leituras automáticas (maior fonte, entrada mais e menos valiosa,
    onde está o maior esforço, maior gargalo);
  - o gap até a meta, se "meta_receita" vier no JSON.

Serve para:
  1. conferir os números que você vai escrever no chat;
  2. entregar o plano no chat quando não der para gerar a planilha;
  3. ter os valores calculados, já que a planilha sai com fórmulas e elas só
     são calculadas quando o arquivo é aberto no Excel, Google Planilhas ou
     LibreOffice.

As fórmulas são as mesmas da aba "1. Plano de Receita".
"""

import json
import math
import sys


def _div(a, b):
    try:
        if a is None or b in (None, 0):
            return None
        return a / b
    except (TypeError, ZeroDivisionError):
        return None


def calcular(dados):
    """Devolve um dicionário com linhas por fonte, total, leituras e meta."""
    linhas = []
    for f in dados.get("fontes") or []:
        ent = f.get("entradas") or 0
        prop = f.get("propostas") or 0
        ven = f.get("vendas") or 0
        rec = f.get("receita") or 0
        linhas.append({
            "fonte": f.get("fonte", ""),
            "entradas": ent, "propostas": prop, "vendas": ven, "receita": rec,
            "ticket": _div(rec, ven),
            "conv_ent_prop": _div(prop, ent),
            "conv_prop_venda": _div(ven, prop),
            "conv_ent_venda": _div(ven, ent),
            "receita_por_entrada": _div(rec, ent),
        })
    tot_rec = sum(l["receita"] for l in linhas)
    for l in linhas:
        l["pct_receita"] = _div(l["receita"], tot_rec)

    total = {
        "fonte": "TOTAL",
        "entradas": sum(l["entradas"] for l in linhas),
        "propostas": sum(l["propostas"] for l in linhas),
        "vendas": sum(l["vendas"] for l in linhas),
        "receita": tot_rec,
    }
    total.update({
        "ticket": _div(total["receita"], total["vendas"]),
        "conv_ent_prop": _div(total["propostas"], total["entradas"]),
        "conv_prop_venda": _div(total["vendas"], total["propostas"]),
        "conv_ent_venda": _div(total["vendas"], total["entradas"]),
        "receita_por_entrada": _div(total["receita"], total["entradas"]),
        "pct_receita": 1.0 if tot_rec else None,
    })

    def _extremo(chave, maior=True):
        validas = [l for l in linhas if l.get(chave) is not None]
        if not validas:
            return None
        return (max if maior else min)(validas, key=lambda l: l[chave])

    leituras = []
    for rotulo, chave, maior in (
        ("Sua maior fonte de receita", "receita", True),
        ("Sua entrada mais valiosa (maior receita por entrada)", "receita_por_entrada", True),
        ("Sua entrada menos valiosa (menor receita por entrada)", "receita_por_entrada", False),
        ("Onde você gasta mais esforço (mais entradas)", "entradas", True),
        ("Seu maior gargalo (pior conversão entrada→venda)", "conv_ent_venda", False),
    ):
        l = _extremo(chave, maior)
        if l is not None:
            leituras.append({"rotulo": rotulo, "fonte": l["fonte"], "chave": chave, "valor": l[chave]})

    meta = dados.get("meta_receita")
    meta_info = None
    if meta:
        gap = meta - tot_rec
        melhor = _extremo("receita_por_entrada", True)
        entradas_faltando = None
        if gap > 0 and melhor and melhor["receita_por_entrada"]:
            # mesmo cálculo do Simulador de Meta: ROUNDUP(gap / maior receita por entrada)
            entradas_faltando = math.ceil(gap / melhor["receita_por_entrada"])
        meta_info = {"meta": meta, "realizado": tot_rec, "gap": gap,
                     "melhor_canal": melhor["fonte"] if melhor else None,
                     "entradas_faltando_no_melhor_canal": entradas_faltando}

    return {"linhas": linhas, "total": total, "leituras": leituras, "meta": meta_info}


def _rs(v, casas=0):
    if v is None:
        return "-"
    s = f"{v:,.{casas}f}"
    s = s.replace(",", "X").replace(".", ",").replace("X", ".")
    return f"R$ {s}"


def _pct(v):
    return "-" if v is None else f"{v * 100:.1f}%".replace(".", ",")


def _num(v):
    return "-" if v is None else f"{v:,.0f}".replace(",", ".")


def markdown(res, dados=None):
    dados = dados or {}
    ne = dados.get("nome_entrada", "Entradas")
    np_ = dados.get("nome_proposta", "Propostas")
    out = []
    out.append(f"| Fonte de receita | {ne} | {np_} | Vendas | Receita | Ticket médio | "
               "Conv. entrada→proposta | Conv. proposta→venda | Conv. entrada→venda | "
               "Receita por entrada | % da receita |")
    out.append("|---|---|---|---|---|---|---|---|---|---|---|")
    for l in res["linhas"] + [res["total"]]:
        out.append("| {fonte} | {e} | {p} | {v} | {r} | {t} | {c1} | {c2} | {c3} | {rpe} | {pct} |".format(
            fonte=l["fonte"], e=_num(l["entradas"]), p=_num(l["propostas"]), v=_num(l["vendas"]),
            r=_rs(l["receita"]), t=_rs(l["ticket"]), c1=_pct(l["conv_ent_prop"]),
            c2=_pct(l["conv_prop_venda"]), c3=_pct(l["conv_ent_venda"]),
            rpe=_rs(l["receita_por_entrada"], 2), pct=_pct(l["pct_receita"])))
    out.append("")
    out.append("Leituras automáticas:")
    for x in res["leituras"]:
        if x["chave"] == "receita":
            val = _rs(x["valor"])
        elif x["chave"] == "receita_por_entrada":
            val = _rs(x["valor"], 2)
        elif x["chave"] == "entradas":
            val = _num(x["valor"])
        else:
            val = _pct(x["valor"])
        out.append(f"- {x['rotulo']}: {x['fonte']} ({val})")
    m = res["meta"]
    if m:
        out.append("")
        out.append(f"Meta: {_rs(m['meta'])} · Hoje: {_rs(m['realizado'])} · Gap: {_rs(m['gap'])}")
        if m["entradas_faltando_no_melhor_canal"]:
            out.append(f"Para fechar o gap só com o canal de maior receita por entrada "
                       f"({m['melhor_canal']}): {m['entradas_faltando_no_melhor_canal']} "
                       "entradas a mais, mantida a conversão atual.")
    return "\n".join(out)


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    with open(sys.argv[1], encoding="utf-8") as fh:
        dados = json.load(fh)
    if not dados.get("fontes"):
        print("ERRO: o JSON precisa ter a chave 'fontes' com pelo menos uma fonte.")
        sys.exit(1)
    print(markdown(calcular(dados), dados))


if __name__ == "__main__":
    main()
