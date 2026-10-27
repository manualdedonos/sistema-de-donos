// Guarda o progresso no próprio navegador do empresário, para ele poder fechar a aba
// e voltar de onde parou. Nada sai da máquina dele: não há servidor nem rastreio.

const CHAVE = "sistema-de-donos:jornada:v2";

export function carregarProgresso() {
  try {
    const bruto = localStorage.getItem(CHAVE);
    return bruto ? JSON.parse(bruto) : null;
  } catch (erro) {
    // Navegação privada ou armazenamento bloqueado: o guia funciona, só não lembra.
    console.warn("Sistema de Donos: não foi possível ler o progresso salvo.", erro);
    return null;
  }
}

export function salvarProgresso(estado) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(estado));
  } catch (erro) {
    console.warn("Sistema de Donos: não foi possível salvar o progresso.", erro);
  }
}

export function apagarProgresso() {
  try {
    localStorage.removeItem(CHAVE);
  } catch (erro) {
    console.warn("Sistema de Donos: não foi possível apagar o progresso.", erro);
  }
}
