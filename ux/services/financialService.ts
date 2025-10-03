import { StockPoint, NewsArticle } from '../types';

// MOCK DATA - In a real app, this would be a real API call.

export const fetchStockData = async (ticker: string): Promise<StockPoint[]> => {
  console.log(`Fetching stock data for ${ticker}...`);
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const data: StockPoint[] = [];
  let price = 150 + Math.random() * 50;
  const today = new Date();

  for (let i = 60; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    price += (Math.random() - 0.5) * 5;
    if (price < 10) price = 10;
    data.push({
      date: date.toISOString().split('T')[0],
      price: parseFloat(price.toFixed(2)),
    });
  }
  return data;
};

export const fetchRecentNews = async (ticker: string): Promise<NewsArticle[]> => {
    console.log(`Fetching news for ${ticker}...`);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const now = Date.now();
    return [
        { id: 'news1', headline: `${ticker} объявляет о рекордной квартальной прибыли, превзойдя все ожидания аналитиков.`, content: 'Подробное содержание о рекордной прибыли...', source: 'Global Business Times', timestamp: now - 86400000 * 0.5, url: '#' },
        { id: 'news2', headline: `Растут регуляторные опасения по поводу новой продуктовой линейки ${ticker}.`, content: 'Содержание о регуляторных препятствиях...', source: 'Finance Watch', timestamp: now - 86400000 * 1.2, url: '#' },
        { id: 'news6', headline: `${ticker} запускает инновационную программу по обратному выкупу акций.`, content: 'Компания объявила о новой программе обратного выкупа акций на сумму 5 миллиардов долларов...', source: 'Market Insider', timestamp: now - 86400000 * 1.2, url: '#' },
        { id: 'news3', headline: `${ticker} выступит на предстоящей технологической конференции.`, content: 'Стандартное объявление о презентации на конференции.', source: 'TechCrunch', timestamp: now - 86400000 * 2, url: '#' },
        { id: 'news4', headline: `Рыночные аналитики повышают рейтинг акций ${ticker} до 'Активно покупать' после демонстрации инноваций.`, content: 'Позитивный анализ от рыночных экспертов...', source: 'Market Insights', timestamp: now - 86400000 * 2.5, url: '#' },
        { id: 'news5', headline: `Генеральный директор ${ticker} продает небольшую часть личных акций.`, content: 'Детали о продаже акций генеральным директором...', source: 'SEC Filings Daily', timestamp: now - 86400000 * 3, url: '#' },
        { id: 'news7', headline: `Аналитики понижают рейтинг ${ticker} из-за проблем с поставками.`, content: 'Ведущее аналитическое агентство понизило рейтинг акций компании до "Продавать"...', source: 'Wall Street Journal', timestamp: now - 86400000 * 4, url: '#' },
        { id: 'news8', headline: `${ticker} сталкивается с судебным иском по поводу нарушения патентных прав.`, content: 'Против компании подан крупный судебный иск, который может привести к значительным штрафам...', source: 'Legal Times', timestamp: now - 86400000 * 5, url: '#' },
        { id: 'news9', headline: `${ticker} объявляет о стратегическом партнерстве с технологическим гигантом.`, content: 'Компания заключила многолетнее соглашение о партнерстве для разработки продуктов нового поколения.', source: 'Tech Innovator', timestamp: now - 86400000 * 0.8, url: '#' },
        { id: 'news10', headline: `Ключевой топ-менеджер ${ticker} неожиданно покидает компанию.`, content: 'Уход ключевого руководителя вызывает вопросы о будущем продуктовой стратегии.', source: 'Corporate Shakeup', timestamp: now - 86400000 * 1.5, url: '#' }
    ];
};