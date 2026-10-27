"""Gera, a partir de catalogo.json, a skill boas-vindas e o site/catalogo.js.
Uso: python3 scripts/gerar.py   (na raiz do repositório)"""
import json, os, sys
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
cat = json.load(open(os.path.join(RAIZ, "catalogo.json"), encoding="utf-8"))
pasta_skills = os.path.join(RAIZ, "plugins", "sistema-de-donos", "skills")

# Toda skill do catálogo tem que existir no plugin, e vice-versa: o catálogo não pode mentir.
no_plugin = {d for d in os.listdir(pasta_skills) if os.path.isfile(os.path.join(pasta_skills, d, "SKILL.md"))} - {"boas-vindas"}
no_catalogo = {s["id"] for s in cat["skills"]}
if no_plugin != no_catalogo:
    sys.exit(f"Catálogo e plugin divergem. Só no plugin: {sorted(no_plugin - no_catalogo)}. Só no catálogo: {sorted(no_catalogo - no_plugin)}")
areas_invalidas = [s["id"] for s in cat["skills"] if s["area"] not in cat["areas"]]
if areas_invalidas:
    sys.exit(f"Área fora da lista em: {areas_invalidas}")

# Material compartilhado (ex.: a linguagem do Rony) mora uma vez em compartilhado/ e é copiado
# para dentro de cada skill que o declara em "referencias": a skill instalada precisa ter o arquivo.
import shutil
for s in cat["skills"]:
    for ref in s.get("referencias", []):
        origem = os.path.join(RAIZ, "compartilhado", ref)
        if not os.path.isfile(origem):
            sys.exit(f"{s['id']}: referência compartilhada inexistente: {ref}")
        destino = os.path.join(pasta_skills, s["id"], "references")
        os.makedirs(destino, exist_ok=True)
        shutil.copyfile(origem, os.path.join(destino, ref))

versao = json.load(open(os.path.join(RAIZ, "plugins", "sistema-de-donos", ".claude-plugin", "plugin.json")))["version"]
linhas = []
for area in cat["areas"]:
    itens = [s for s in cat["skills"] if s["area"] == area]
    if not itens:
        continue
    linhas.append(f"   **{area}**")
    linhas += [f"   - **{s['nome']}**: {s['paraQue']}" + (f" (só no {s['onde']} no computador)" if s.get("onde") else "") for s in itens]
boas_vindas = f"""---
name: boas-vindas
description: Confirma que o Sistema de Donos está instalado e mostra as skills do Manual de Donos que vêm nele. Use quando o usuário disser "sistema de donos", "testar o sistema", "o sistema está funcionando?" ou pedir para ver as skills do Manual de Donos.
---

Responda em português, em tom direto e acolhedor:

1. Confirme: "O Sistema de Donos está instalado e funcionando (versão {versao}), com {len(cat['skills'])} skills do Manual de Donos."
2. Liste as skills por área, uma linha cada:
{chr(10).join(linhas)}
3. Termine com um exemplo de pedido que ele pode fazer agora: "{cat['skills'][0]['exemplo']}"
"""
os.makedirs(os.path.join(pasta_skills, "boas-vindas"), exist_ok=True)
open(os.path.join(pasta_skills, "boas-vindas", "SKILL.md"), "w", encoding="utf-8").write(boas_vindas)

campos = ("nome", "area", "paraQue", "exemplo", "onde")
skills_js = [{k: s[k] for k in campos if k in s} for s in cat["skills"]]
js = ("// Gerado por scripts/gerar.py a partir de catalogo.json. Não edite à mão.\n"
      f"export const AREAS = {json.dumps(cat['areas'], ensure_ascii=False)};\n"
      f"export const SKILLS = {json.dumps(skills_js, ensure_ascii=False, indent=2)};\n")
open(os.path.join(RAIZ, "site", "catalogo.js"), "w", encoding="utf-8").write(js)
print(f"ok: {len(cat['skills'])} skills, versão {versao}")
