import React, { useState, useCallback } from 'react';
import { StockPoint, AnalyzedNews } from './types';
import { fetchStockData, fetchRecentNews } from './services/financialService';
import { analyzeNews } from './services/llm';
import TickerInput from './components/TickerInput';
import Dashboard from './components/Dashboard';
import { LoadingSpinner } from './components/icons/LoadingSpinner';

const App: React.FC = () => {
    const [ticker, setTicker] = useState<string | null>(null);
    const [stockData, setStockData] = useState<StockPoint[]>([]);
    const [analyzedNews, setAnalyzedNews] = useState<AnalyzedNews[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleTickerSubmit = useCallback(async (submittedTicker: string) => {
        setIsLoading(true);
        setError(null);
        setTicker(submittedTicker.toUpperCase());
        setStockData([]);
        setAnalyzedNews([]);

        try {
            const [stock, rawNews] = await Promise.all([
                fetchStockData(submittedTicker),
                fetchRecentNews(submittedTicker),
            ]);

            if (!rawNews || rawNews.length === 0) {
                 setStockData(stock);
                 setIsLoading(false);
                 return;
            }

            const analyzed = await analyzeNews(rawNews);
            
            setStockData(stock);
            setAnalyzedNews(analyzed);

        } catch (err) {
            console.error("Failed to fetch or analyze data:", err);
            setError("Failed to retrieve and analyze data. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    return (
        <div className="bg-gray-900 min-h-screen text-white font-sans">
            <header className="py-8 text-center border-b border-gray-800">
                <div className="container mx-auto px-4">
                     <h1 className="text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-500 mb-2">
                        РАДАР: Анализ финансовых новостей
                    </h1>
                     <p className="text-xl text-gray-400">Анализ настроений в новостях на базе ИИ</p>
                </div>
            </header>
            <main className="container mx-auto p-4 md:p-8">
                <section id="input-section" className="mb-12 text-center">
                    <TickerInput onSubmit={handleTickerSubmit} isLoading={isLoading} />
                </section>

                {isLoading && (
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <LoadingSpinner />
                        <p className="text-lg text-gray-400">Анализ данных... Это может занять несколько секунд.</p>
                    </div>
                )}
                
                {error && <p className="text-center text-red-500 text-lg">{error}</p>}

                {!isLoading && !error && ticker && stockData.length > 0 && (
                    <Dashboard
                        ticker={ticker}
                        stockData={stockData}
                        analyzedNews={analyzedNews}
                    />
                )}

                {!isLoading && !ticker && (
                    <div className="text-center text-gray-500">
                        <p>Начните с ввода тикера акции для получения анализа.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default App;