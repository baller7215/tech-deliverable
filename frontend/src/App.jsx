import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import Header from './Header';
import './index.css';
import Quote from './Quote';
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowDown, ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Define animation variants
const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1 } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
        }
    }
};

function App() {
    const [quotes, setQuotes] = useState([]);
    const [sortedQuotes, setSortedQuotes] = useState([]);
    const [selectedTab, setSelectedTab] = useState("all");
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [isAtBottom, setIsAtBottom] = useState(false);
    const [isGrid, setIsGrid] = useState(false);
    const [selectedQuote, setSelectedQuote] = useState(null);

    const { toast } = useToast();
    const quotesRef = useRef(null);

    useEffect(() => {
        fetchQuotes(selectedTab);
    }, [selectedTab]);

    const fetchQuotes = async (selectedTab) => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/quotes?max_age=${selectedTab}`);
            const sorted = response.data.sort((a, b) => new Date(b.time) - new Date(a.time));
            setQuotes(response.data);
            setSortedQuotes(sorted);
        } catch (error) {
            console.error('Error fetching quotes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('message', message);

            await axios.post('api/quote', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            fetchQuotes(selectedTab);
            setName("");
            setMessage("");

            toast({
                title: "Submitted Quote",
                description: `${message} by ${name}`,
            });
        } catch (error) {
            console.error('Error submitting quote:', error);
            toast({
                title: "Failed to Submit Quote",
                description: "There was an error submitting your quote.",
                status: "error",
            });
        }
    };

    const scrollToBottom = () => {
        quotesRef.current?.scrollTo({ top: quotesRef.current.scrollHeight, behavior: 'smooth' });
    };

    const scrollToTop = () => {
        quotesRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleScroll = () => {
        if (quotesRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = quotesRef.current;
            setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 5);
        }
    };

    useEffect(() => {
        const quotesElement = quotesRef.current;
        if (quotesElement) {
            quotesElement.addEventListener('scroll', handleScroll);
            return () => quotesElement.removeEventListener('scroll', handleScroll);
        }
    }, []);

    return (
        <div className="App relative isolate bg-[url('./public/background.png')] bg-white/70 bg-center bg-cover bg-fixed min-h-dvh flex-grow">
            <Header />

            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-5 justify-center h-full my-auto jetbrains-mono"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
            >
                <motion.div
                    className="hoverLarge scale-95 hover:!scale-100 max-w-[800px] w-full h-full py-10 px-5 md:px-10 bg-blue-700/15 rounded-lg border-[1px] border-transparent shadow-md mx-auto my-auto justify-center"
                    variants={fadeInUp}
                >
                    <div className="max-w-[500px] h-full m-auto flex flex-col justify-center gap-5">
                        <motion.h2
                            className="text-center lowercase text-5xl lg:text-8xl text-black"
                            variants={fadeInUp}
                        >
                            Submit a quote
                        </motion.h2>
                        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
                            <motion.div className="flex flex-col gap-2" variants={fadeInUp}>
                                <label htmlFor="input-name" className="lowercase text-xl text-black">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    id="input-name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="hoverTransition w-full text-xl lg:text-3xl bg-white/30 text-black rounded-xl shadow-md p-3 border-[3px] border-transparent hover:border-blue-400 focus:border-blue-400"
                                    placeholder="peter the anteater"
                                    required
                                />
                            </motion.div>
                            <motion.div className="flex flex-col gap-2" variants={fadeInUp}>
                                <label htmlFor="input-message" className="lowercase text-xl text-black">Quote</label>
                                <textarea
                                    type="text"
                                    name="message"
                                    id="input-message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="hoverTransition w-full text-xl md:text-3xl bg-white/30 text-black rounded-xl shadow-md p-3 border-[3px] border-transparent hover:border-blue-400 focus:border-blue-400 max-h-[20vh]"
                                    placeholder="zot! zot! zot!"
                                    required
                                />
                            </motion.div>
                            <motion.button
                                type="submit"
                                className="hoverTransition bg-blue-500/50 border-[3px] border-transparent hover:border-blue-500/50 hover:bg-transparent rounded-full p-3 text-xl md:text-3xl mt-5"
                                variants={fadeIn}
                            >
                                Submit
                            </motion.button>
                        </form>
                    </div>
                </motion.div>
                <div className="w-full h-full max-h-[80vh] flex flex-col gap-5 p-5 px-0 md:px-5" id="quotes">
                    <motion.div
                        className="bg-transparent shadow-md rounded-full border-[2px] h-auto w-full min-w-full flex flex-row justify-between place-items-center gap-3"
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                    >
                        {['all', 'week', 'month', 'year'].map((value) => (
                            <motion.button
                                key={value}
                                onClick={() => setSelectedTab(value)}
                                className={`hoverTransition lowercase text-lg md:text-xl w-full text-gray-500 rounded-full p-2 m-1 ${value === selectedTab ? 'bg-blue-700/15' : ''}`}
                                variants={fadeIn}
                            >
                                {value}
                            </motion.button>
                        ))}
                    </motion.div>

                    <div ref={quotesRef} className={`w-full min-w-full h-[100vh] md:h-[70vh] overflow-y-auto py-3 shadow-md bg-transparent border-[2px] rounded-xl ${isGrid ? 'grid grid-cols-1 md:grid-cols-2 gap-1' : 'flex flex-col gap-3'}`}>
                        {loading ? (
                            Array(8).fill(0).map((_, index) => (
                                <Skeleton key={index} className="scale-90 shadow-md w-full rounded-lg h-28" />
                            ))
                        ) : (
                            <>
                                {sortedQuotes.map((quote, index) => (
                                    <motion.div
                                        layoutId={`quote-${index}`}
                                        key={index}
                                        onClick={() => setSelectedQuote(index)}
                                        variants={fadeInUp}
                                        initial="hidden"
                                        animate="visible"
                                    >
                                        <Quote quote={quote} />
                                    </motion.div>
                                ))}

                                <AnimatePresence>
                                    {selectedQuote !== null && (
                                        <motion.div
                                            layoutId={`quote-${selectedQuote}`}
                                            className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50"
                                        >
                                            {/* Overlay to detect clicks outside */}
                                            <div
                                                className="absolute top-0 left-0 w-full h-full bg-gray-300/50"
                                                onClick={() => setSelectedQuote(null)}
                                            ></div>
                                            {/* Quote content */}
                                            <motion.div
                                                className="relative z-10"
                                                onClick={(e) => e.stopPropagation()}
                                                variants={fadeIn}
                                                initial="hidden"
                                                animate="visible"
                                            >
                                                <Quote quote={sortedQuotes[selectedQuote]} />
                                            </motion.div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Grid or List Tabs */}
            <div className="fixed bottom-5 left-5 flex flex-col gap-3">
                <div className="bg-white shadow-md rounded-full border-[2px] h-auto w-full min-w-full flex flex-row justify-between place-items-center gap-2">
                    {['list', 'grid'].map((value) => (
                        <motion.button
                            key={value}
                            onClick={() => setIsGrid(value === 'grid')}
                            className={`hoverTransition lowercase text-lg md:text-xl w-full text-gray-500 rounded-full p-2 px-5 m-1 ${isGrid === (value === 'grid') ? 'bg-blue-700/15' : ''}`}
                            variants={fadeIn}
                            initial="hidden"
                            animate="visible"
                        >
                            {value}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Scroll Buttons */}
            <div className="fixed bottom-5 right-5 flex flex-col gap-3">
                {!isAtBottom && (
                    <motion.button
                        onClick={scrollToBottom}
                        className="hoverTransition bg-blue-500 text-white border-transparent border-[2px] hover:bg-transparent hover:border-blue-500 hover:text-blue-500 p-3 rounded-full shadow-md"
                        variants={fadeIn}
                        initial="hidden"
                        animate="visible"
                    >
                        <ArrowDown size={25} />
                    </motion.button>
                )}
                {isAtBottom && (
                    <motion.button
                        onClick={scrollToTop}
                        className="hoverTransition bg-blue-500 text-white border-transparent border-[2px] hover:bg-transparent hover:border-blue-500 hover:text-blue-500 p-3 rounded-full shadow-md"
                        variants={fadeIn}
                        initial="hidden"
                        animate="visible"
                    >
                        <ArrowUp size={25} />
                    </motion.button>
                )}
            </div>
        </div>
    );
}

export default App;