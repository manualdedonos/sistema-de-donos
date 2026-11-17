#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
DRE de Donos · Manual de Donos
Valida o JSON da DRE, mostra a conta fechada para conferência e monta o painel.

Uso:
  python3 montar_dre.py dados.json                 -> gera dre-de-donos-<negocio>-<mes>.html na pasta atual
  python3 montar_dre.py dados.json --saida pasta/  -> gera na pasta indicada
  python3 montar_dre.py dados.json --so-validar    -> só confere, não gera arquivo

Gera dois arquivos com o mesmo painel:
  <nome>.html            documento completo (abrir no navegador, entregar como arquivo, ou publicar em
                         ferramenta que pede um documento HTML inteiro)
  <nome>.pagina.html     só o conteúdo, sem doctype/html/head/body (para a ferramenta Artifact, que já
                         coloca a moldura da página)
Sai com código 1 se houver ERRO. AVISOS não impedem a geração: leia e decida.
"""
import argparse, datetime, json, pathlib, re, sys, unicodedata

AQUI = pathlib.Path(__file__).resolve().parent
TEMPLATE = AQUI.parent / 'assets' / 'template-dre.html'

# id: (categoria, estágios em que aparece, nome)
LINHAS = {
    'receita_bruta': ('receita', (1, 2, 3), 'Receita bruta'),
    'impostos_vendas': ('ded', (1, 2, 3), 'Impostos sobre as vendas'),
    'devolucoes': ('ded', (2, 3), 'Devoluções e descontos'),
    'custo_direto': ('custo', (1, 2, 3), 'Custo direto'),
    'despesas_variaveis': ('var', (1, 2), 'Despesas que variam com a venda'),
    'comissoes': ('var', (3,), 'Comissões de venda'),
    'taxas_pagamento': ('var', (3,), 'Taxas de cartão e marketplace'),
    'fretes': ('var', (3,), 'Fretes e entregas'),
    'outras_variaveis': ('var', (3,), 'Outras despesas variáveis'),
    'pessoal': ('fixa', (1, 2, 3), 'Pessoal'),
    'pro_labore': ('fixa', (2, 3), 'Pró-labore dos sócios'),
    'ocupacao': ('fixa', (1, 2, 3), 'Aluguel e estrutura'),
    'marketing': ('fixa', (1, 2, 3), 'Marketing e vendas'),
    'tecnologia': ('fixa', (3,), 'Tecnologia e sistemas'),
    'administrativas': ('fixa', (2, 3), 'Administrativas'),
    'outras_fixas': ('fixa', (1, 2, 3), 'Outras despesas'),
    'depreciacao': ('da', (2, 3), 'Depreciação e amortização'),
    'receitas_financeiras': ('finp', (3,), 'Receitas financeiras'),
    'despesas_financeiras': ('finn', (2, 3), 'Despesas financeiras'),
    'ir_csll': ('ir', (2, 3), 'IR e CSLL'),
}
SUBTOTAIS = ('receita_liquida', 'lucro_bruto', 'margem_contribuicao', 'ebitda', 'ebit', 'lair', 'lucro_liquido')
EXTRAS = ('funcionarios', 'clientes_novos', 'num_vendas', 'caixa_final')
BENCH = ('margem_bruta', 'margem_contribuicao', 'margem_ebitda', 'margem_liquida', 'custo_direto', 'folha',
         'ocupacao', 'marketing', 'impostos', 'receita_por_pessoa', 'cac')
REGIMES = ('simples', 'presumido', 'real', 'mei', 'nao_sei')
TONS = ('bom', 'atencao', 'critico')
MES_RE = re.compile(r'^\d{4}-(0[1-9]|1[0-2])$')
SEM_ACENTO = re.compile(r'\b(Mes|mes|Analise|analise|Acao|acao|Acoes|acoes|Servico|servico|Servicos|servicos|Receita liquida|Lucro liquido|Margem liquida|Pro-labore|pro-labore|Nao|nao|Voce|voce|Reducao|reducao|Preco|preco|Negocio|negocio|Ate|Equilibrio|equilibrio|Codigo|Numero|numero|Custos fixos mensal)\b')


def n(v):
    return float(v) if isinstance(v, (int, float)) and not isinstance(v, bool) else 0.0


def calcular(v, x=None):
    """Mesma conta do painel. v = valores do mês; x = dados de apoio."""
    x = x or {}
    soma = lambda cat: sum(n(v.get(i)) for i, d in LINHAS.items() if d[0] == cat)
    r = {}
    r['receita_bruta'] = n(v.get('receita_bruta'))
    r['deducoes'] = soma('ded')
    r['receita_liquida'] = r['receita_bruta'] - r['deducoes']
    r['custo_direto'] = soma('custo')
    r['lucro_bruto'] = r['receita_liquida'] - r['custo_direto']
    r['variaveis'] = soma('var')
    r['margem_contribuicao'] = r['lucro_bruto'] - r['variaveis']
    r['fixas'] = soma('fixa')
    r['ebitda'] = r['margem_contribuicao'] - r['fixas']
    r['depreciacao'] = n(v.get('depreciacao'))
    r['ebit'] = r['ebitda'] - r['depreciacao']
    r['fin'] = n(v.get('receitas_financeiras')) - n(v.get('despesas_financeiras'))
    r['lair'] = r['ebit'] + r['fin']
    r['ir'] = n(v.get('ir_csll'))
    r['lucro_liquido'] = r['lair'] - r['ir']
    rl = r['receita_liquida']
    p = lambda a: a / rl * 100 if rl > 0 else None
    r['pessoal_total'] = n(v.get('pessoal')) + n(v.get('pro_labore'))
    r['pct'] = {
        'margem_bruta': p(r['lucro_bruto']), 'margem_contribuicao': p(r['margem_contribuicao']),
        'margem_ebitda': p(r['ebitda']), 'margem_liquida': p(r['lucro_liquido']),
        'custo_direto': p(r['custo_direto']), 'folha': p(r['pessoal_total']),
        'ocupacao': p(n(v.get('ocupacao'))), 'marketing': p(n(v.get('marketing'))),
        'impostos': (n(v.get('impostos_vendas')) + r['ir']) / r['receita_bruta'] * 100 if r['receita_bruta'] > 0 else None,
    }
    r['fixas_totais'] = r['fixas'] + r['depreciacao'] - r['fin']
    mc = r['pct']['margem_contribuicao']
    r['pe'] = r['fixas_totais'] / (mc / 100) if mc and mc > 0 else None
    r['seguranca'] = (rl - r['pe']) / rl * 100 if r['pe'] is not None and rl > 0 else None
    f, cn, nv = n(x.get('funcionarios')), n(x.get('clientes_novos')), n(x.get('num_vendas'))
    r['receita_por_pessoa'] = rl / f if f > 0 and rl > 0 else None
    r['cac'] = (n(v.get('marketing')) + n(v.get('comissoes'))) / cn if cn > 0 else None
    r['ticket'] = r['receita_bruta'] / nv if nv > 0 else None
    return r


def slug(s):
    s = unicodedata.normalize('NFD', str(s or 'dre')).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+', '-', s).strip('-') or 'dre'


def brl(v):
    if v is None:
        return '—'
    return ('-' if v < 0 else '') + 'R$ ' + f'{abs(round(v)):,}'.replace(',', '.')


def pc(v):
    return '—' if v is None else f'{v:.1f}%'.replace('.', ',')


def textos(o, caminho=''):
    if isinstance(o, str):
        yield caminho, o
    elif isinstance(o, dict):
        for k, w in o.items():
            yield from textos(w, f'{caminho}.{k}' if caminho else k)
    elif isinstance(o, list):
        for i, w in enumerate(o):
            yield from textos(w, f'{caminho}[{i}]')


def validar(d):
    erros, avisos = [], []
    E, A = erros.append, avisos.append
    if not isinstance(d, dict):
        return ['O JSON precisa ser um objeto.'], []
    if not str(d.get('negocio') or '').strip():
        E('Falta "negocio" (nome do negócio).')
    est = d.get('estagio')
    if est not in (1, 2, 3):
        E('"estagio" precisa ser 1, 2 ou 3.')
        est = 1
    if d.get('regime') not in REGIMES:
        A(f'"regime" deveria ser um de {REGIMES}. Veio: {d.get("regime")!r}.')
    meses = d.get('meses')
    if not isinstance(meses, dict) or not meses:
        E('Falta "meses" com pelo menos um mês no formato AAAA-MM.')
        return erros, avisos
    for m in meses:
        if not MES_RE.match(m):
            E(f'Mês inválido: {m!r}. Use AAAA-MM.')
    if d.get('mesAtual') not in meses:
        E(f'"mesAtual" ({d.get("mesAtual")!r}) precisa ser uma das chaves de "meses".')
    elif d.get('mesAtual') != sorted(meses)[-1]:
        A(f'"mesAtual" ({d["mesAtual"]}) não é o mês mais recente ({sorted(meses)[-1]}). O painel abre no mesAtual: confirme se é isso mesmo.')
    hoje = datetime.date.today().strftime('%Y-%m')
    for m in meses:
        if MES_RE.match(m) and m >= hoje:
            A(f'{m} ainda não fechou (hoje é {hoje}). A DRE de Donos começa pelo último mês fechado.')
    for m, M in meses.items():
        if not isinstance(M, dict) or not isinstance(M.get('valores'), dict):
            E(f'{m}: falta "valores".')
            continue
        v = M['valores']
        for k, val in v.items():
            if k in SUBTOTAIS:
                A(f'{m}: "{k}" é subtotal e o painel calcula sozinho. Valor ignorado.')
            elif k not in LINHAS:
                E(f'{m}: linha desconhecida "{k}". IDs válidos: {", ".join(LINHAS)}.')
            elif val is not None and (isinstance(val, bool) or not isinstance(val, (int, float))):
                E(f'{m}: "{k}" precisa ser número ou null. Veio {val!r}.')
            elif val is not None and val < 0:
                A(f'{m}: "{k}" está negativo ({val}). Custos e despesas entram positivos; o painel aplica o sinal.')
            elif val is not None and val != round(val):
                A(f'{m}: "{k}" tem centavos ({val}). Arredonde para reais inteiros.')
        if not n(v.get('receita_bruta')) > 0:
            (E if m == d.get('mesAtual') else A)(f'{m}: receita_bruta vazia ou zero.')
        if 'despesas_variaveis' in v and n(v.get('despesas_variaveis')) and any(n(v.get(k)) for k in ('comissoes', 'taxas_pagamento', 'fretes', 'outras_variaveis')):
            A(f'{m}: há valor em "despesas_variaveis" E nas linhas abertas (comissoes, taxas_pagamento, fretes, outras_variaveis). O painel soma tudo: confira se não está em dobro.')
        faltam = [k for k, dd in LINHAS.items() if est in dd[1] and v.get(k) is None]
        if faltam:
            A(f'{m}: linhas do estágio {est} sem número (aparecem como "informar" e contam zero): {", ".join(faltam)}.')
        fora = [k for k in v if k in LINHAS and est not in LINHAS[k][1] and n(v.get(k))]
        if fora:
            A(f'{m}: linhas fora do estágio {est} com valor (vão aparecer mesmo assim): {", ".join(fora)}.')
        estm = M.get('estimados') or {}
        if isinstance(estm, list):
            estm = {k: '' for k in estm}
        for k, nota in estm.items():
            if k not in LINHAS:
                E(f'{m}: "estimados" cita linha desconhecida "{k}".')
            elif v.get(k) is None:
                A(f'{m}: "{k}" está em "estimados" mas sem valor.')
            elif not str(nota).strip():
                A(f'{m}: estimativa de "{k}" sem explicação. Escreva a conta em uma frase (ex.: "50% da receita, pelo markup de 2x").')
        for k in (M.get('extras') or {}):
            if k not in EXTRAS:
                A(f'{m}: dado de apoio desconhecido "{k}" (ignorado). Válidos: {", ".join(EXTRAS)}.')
        if d.get('regime') in ('simples', 'mei') and n(v.get('ir_csll')):
            A(f'{m}: regime {d.get("regime")} com IR/CSLL separado. No Simples o IR já está no DAS: confira.')
        r = calcular(v, M.get('extras'))
        if r['receita_liquida'] > 0:
            if r['custo_direto'] > r['receita_liquida']:
                A(f'{m}: custo direto maior que a receita líquida. Confirme com o dono (pode ser compra do mês no lugar do custo do que foi vendido).')
            if n(v.get('impostos_vendas')) / r['receita_bruta'] > 0.35:
                A(f'{m}: impostos sobre vendas acima de 35% da receita bruta. Confirme.')
            if n(v.get('impostos_vendas')) == 0:
                A(f'{m}: impostos sobre vendas zerados. Só é normal para MEI ou isento.')
    for k, b in (d.get('benchmarks') or {}).items():
        if k not in BENCH:
            A(f'benchmarks: chave desconhecida "{k}" (ignorada). Válidas: {", ".join(BENCH)}.')
        elif not isinstance(b, dict) or not all(isinstance(b.get(q), (int, float)) for q in ('min', 'max')) or b['min'] > b['max']:
            E(f'benchmarks.{k}: precisa de "min" e "max" numéricos, com min <= max.')
        elif not str(b.get('fonte') or '').strip():
            A(f'benchmarks.{k}: sem "fonte". Diga de onde vem a faixa em poucas palavras.')
    if not d.get('benchmarks'):
        A('Sem "benchmarks": os indicadores ficam sem faixa de referência e sem julgamento.')
    if not str(d.get('leitura') or '').strip():
        A('Sem "leitura": o painel usa uma leitura automática, mais genérica.')
    elif len(str(d['leitura']).split()) > 60:
        A(f'"leitura" com {len(str(d["leitura"]).split())} palavras. Passe de 45 só se for indispensável.')
    ac = d.get('acoes') or []
    if len(ac) < 3:
        A(f'"acoes" tem {len(ac)} item(ns). O padrão é pelo menos 3, em ordem de impacto.')
    for i, a in enumerate(ac):
        for campo in ('titulo', 'oque', 'porque', 'ganho', 'esforco', 'prazo', 'metrica', 'passo'):
            if not str((a or {}).get(campo) or '').strip():
                A(f'acoes[{i}]: falta "{campo}".')
        if not isinstance((a or {}).get('ganhoMensal'), (int, float)):
            A(f'acoes[{i}]: sem "ganhoMensal" numérico (R$ por mês). Sem ele a barra de impacto não aparece.')
    gm = [a.get('ganhoMensal') for a in ac if isinstance(a.get('ganhoMensal'), (int, float))]
    if gm and gm != sorted(gm, reverse=True):
        A('"acoes" não está em ordem decrescente de ganhoMensal. Se a ordem for proposital (ex.: uma ação destrava a outra), tudo bem.')
    for i, a in enumerate(d.get('achados') or []):
        if (a or {}).get('tom') not in TONS:
            A(f'achados[{i}].tom deveria ser um de {TONS}.')
    if len(d.get('achados') or []) not in (0, 3):
        A('O padrão é 3 "achados" (ficam em três colunas).')
    for caminho, t in textos({k: d.get(k) for k in ('negocio', 'subtitulo', 'segmentoNome', 'leitura', 'achados', 'acoes', 'depois', 'premissas', 'contador', 'limites', 'rotulos', 'ajudas')}):
        if re.search(r'[\U0001F300-\U0001FAFF☀-➿]', t):
            A(f'{caminho}: tem emoji. O padrão do Manual de Donos é sem emoji.')
        if '—' in t or ' – ' in t:
            A(f'{caminho}: tem travessão. Troque por vírgula, dois-pontos ou ponto.')
        mm = SEM_ACENTO.search(t)
        if mm and mm.group(0) not in ('mes', 'Ate'):
            A(f'{caminho}: possível palavra sem acento: "{mm.group(0)}".')
        if re.search(r'<(?!/?(b|i|br)\b)[a-zA-Z/]', t):
            A(f'{caminho}: só <b>, <i> e <br> são aceitos; o resto aparece como texto.')
    return erros, avisos


def conferencia(d):
    linhas = []
    for m in sorted(d['meses']):
        M = d['meses'][m]
        r = calcular(M.get('valores') or {}, M.get('extras'))
        p = r['pct']
        linhas.append(f'\n{m}' + ('  (mês em foco)' if m == d.get('mesAtual') else ''))
        for nome, val, pp in (
            ('Receita bruta', r['receita_bruta'], None), ('Receita líquida', r['receita_liquida'], None),
            ('Lucro bruto', r['lucro_bruto'], p['margem_bruta']), ('Margem de contribuição', r['margem_contribuicao'], p['margem_contribuicao']),
            ('EBITDA', r['ebitda'], p['margem_ebitda']), ('Lucro líquido', r['lucro_liquido'], p['margem_liquida'])):
            linhas.append(f'  {nome:<24}{brl(val):>16}' + (f'   {pc(pp)} da receita líquida' if pp is not None else ''))
        linhas.append(f'  {"Folha":<24}{brl(r["pessoal_total"]):>16}   {pc(p["folha"])} da receita líquida')
        linhas.append(f'  {"Ponto de equilíbrio":<24}{brl(r["pe"]):>16}   margem de segurança {pc(r["seguranca"])}')
        linhas.append(f'  {"Receita por funcionário":<24}{brl(r["receita_por_pessoa"]):>16}   CAC {brl(r["cac"])}   ticket médio {brl(r["ticket"])}')
    return '\n'.join(linhas)


def montar(d, template):
    html = template.read_text(encoding='utf-8')
    ini = '<script type="application/json" id="dados">'
    i = html.find(ini)
    j = html.find('</script>', i)
    if i < 0 or j < 0:
        raise SystemExit('ERRO: não achei o bloco de dados no template.')
    dados = json.dumps(d, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
    html = html[:i + len(ini)] + dados + html[j:]
    html = html.replace('<title>DRE de Donos</title>', '<title>DRE de Donos · ' + str(d.get('negocio', '')).replace('<', '').replace('&', 'e') + '</title>', 1)
    pagina = re.sub(r'^\s*<!doctype html>\s*', '', html, flags=re.I)
    pagina = re.sub(r'</?(html|head|body)\b[^>]*>\s*', '', pagina, flags=re.I)
    pagina = re.sub(r'<meta (charset|name="viewport")[^>]*>\s*', '', pagina, flags=re.I)
    return html, pagina


def main():
    ap = argparse.ArgumentParser(description='Valida o JSON e monta o painel DRE de Donos.')
    ap.add_argument('dados')
    ap.add_argument('--saida', default='.', help='pasta (ou caminho .html) de saída')
    ap.add_argument('--so-validar', action='store_true')
    ap.add_argument('--manter-data', action='store_true', help='não carimbar geradoEm com a hora atual')
    a = ap.parse_args()
    try:
        d = json.loads(pathlib.Path(a.dados).read_text(encoding='utf-8'))
    except Exception as e:
        raise SystemExit(f'ERRO: não consegui ler o JSON: {e}')
    erros, avisos = validar(d)
    for t in erros:
        print('ERRO  ', t)
    for t in avisos:
        print('AVISO ', t)
    if erros:
        print(f'\n{len(erros)} erro(s). Corrija o JSON e rode de novo.')
        sys.exit(1)
    print('\nCONFERÊNCIA (é isso que o painel vai mostrar; confira com o que o dono informou):')
    print(conferencia(d))
    if a.so_validar:
        return
    if not a.manter_data or not d.get('geradoEm'):
        d['geradoEm'] = datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
    html, pagina = montar(d, TEMPLATE)
    saida = pathlib.Path(a.saida)
    if saida.suffix.lower() != '.html':
        saida.mkdir(parents=True, exist_ok=True)
        saida = saida / f'dre-de-donos-{slug(d["negocio"])}-{d["mesAtual"]}.html'
    saida.parent.mkdir(parents=True, exist_ok=True)
    saida.write_text(html, encoding='utf-8')
    pag = saida.with_name(saida.stem + '.pagina.html')
    pag.write_text(pagina, encoding='utf-8')
    print(f'\nPAINEL    {saida}\nPÁGINA    {pag}   (use este na ferramenta Artifact)')
    print(f'{len(avisos)} aviso(s).' if avisos else 'Sem avisos.')


if __name__ == '__main__':
    main()
