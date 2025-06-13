export function formatDate(date) {
  // Garante que 'date' seja um objeto Date válido
  const validDate = new Date(date);

  // Verificação simples para datas inválidas
  if (isNaN(validDate.getTime())) {
    return 'Invalid Date';
  }

  return validDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}