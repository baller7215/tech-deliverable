import React, { useState, useEffect } from "react";
import axios from 'axios';
import Header from './Header';
import './index.css';
import Quote from './Quote';
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";



/** @todo:
 * add sonner / toast when quotes are added
 * add skeletons for loading quotes
 * implement tabs for filtering all, week, month, year
 */
function App() {
	const [quotes, setQuotes] = useState([]);
	const [sortedQuotes, setSortedQuotes] = useState([]);
	const [selectedTab, setSelectedTab] = useState("all");
	const [name, setName] = useState("");
	const [message, setMessage] = useState("");

	const [loading, setLoading] = useState(false);
	const { toast } = useToast();

	// fetch quotes from the API based on the selected tab
	useEffect(() => {
		fetchQuotes(selectedTab);
	}, [selectedTab]);

	// method to fetch quotes
	const fetchQuotes = async (selectedTab) => {
		setLoading(true);
		try {
			console.log('fetching quotes now');
			const response = await axios.get(`/api/quotes?max_age=${selectedTab}`);
			setQuotes(response.data);
			const sorted = response.data.sort((a, b) => new Date(b.time) - new Date(a.time));
			setSortedQuotes(sorted);
			console.log('updated quotes\n', sortedQuotes);
		} catch (error) {
			console.error('Error fetching quotes:', error);
		} finally {
			setTimeout(() => {
				setLoading(false);
			}, 1000);
		}
	};

	// method that handles submitting and making post request
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

			console.log('submitted quote:');
			fetchQuotes(selectedTab);
			setName("");
			setMessage("");

			// display toast from shadcn ui library
			toast({
				title: "submitted quote",
				description: `${message} by ${name}`,
			})
		} catch (error) {
			console.error('Error submitting quote:', error);
			toast({
                title: "failed to submit quote",
                description: "there was an error submitting your quote",
                status: "error",
            });
		}
	}


	return (
		<div className={`App relative isolate bg-[url('./public/background.png')] bg-white/70 bg-center bg-cover bg-fixed min-h-dvh flex-grow`}>
			{/* TODO: include an icon for the quote book */}
			<Header />

			<div className="grid grid-cols-1 md:grid-cols-2 gap-5 justify-center h-full my-auto font-mono">
				<div className="hoverLarge scale-95 hover:!scale-100 max-w-[800px] w-full h-full py-10 bg-blue-700/15 rounded-lg border-[1px] border-transparent shadow-md mx-auto my-auto justify-center">
					<div className="max-w-[500px] h-full m-auto flex flex-col justify-center gap-5">
						<h2 className="text-center lowercase text-8xl text-black">Submit a quote</h2>
						{/* TODO: implement custom form submission logic to not refresh the page */}
						<form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
							<div className="flex flex-col gap-2">
								<label
									htmlFor="input-name"
									className="lowercase text-xl text-black"
								>
									Name
								</label>
								<input
									type="text"
									name="name"
									id="input-name"
									value={name}
									onChange={(e) => setName(e.target.value)}
									className="hoverTransition w-full text-3xl bg-white/30 text-black rounded-xl shadow-md p-3 border-[3px] border-transparent hover:border-blue-400 focus:border-blue-400"
									placeholder="peter the anteater"
									required
								/>
							</div>
							<div className="flex flex-col gap-2">
								<label
									htmlFor="input-message"
									className="lowercase text-xl text-black"
								>
									Quote
								</label>
								<textarea
									type="text"
									name="message"
									id="input-message"
									value={message}
									onChange={(e) => setMessage(e.target.value)}
									className="hoverTransition w-full text-3xl bg-white/30 text-black rounded-xl shadow-md p-3 border-[3px] border-transparent hover:border-blue-400 focus:border-blue-400 max-h-[20vh]"
									placeholder="zot! zot! zot!"
									required />
							</div>
							<button
								type="submit"
								className="hoverTransition bg-blue-500/50 border-[3px] border-transparent hover:border-blue-500/50 hover:bg-transparent rounded-full p-3 text-3xl mt-5"
							>
								Submit
							</button>
						</form>
					</div>
				</div>
				<div className="w-full h-full max-h-[80vh] flex flex-col gap-5 p-5" id="quotes">
					{/* <h2 className="lowercase text-5xl text-left">Previous Quotes</h2> */}

					<div className="bg-transparent shadow-md rounded-full border-[2px] h-auto w-full min-w-full flex flex-row justify-between place-items-center gap-3">
						{['all', 'week', 'month', 'year'].map(((value) => {
							return (
								<button
									key={value}
									onClick={() => setSelectedTab(value)}
									className={`hoverTransition lowercase text-xl w-full text-gray-500 rounded-full p-2 m-1
										${value == selectedTab ? 'bg-blue-700/15' : ''}
									`}
								>
									{value}
								</button>
							)
						}))}
					</div>

					<div className="w-full min-w-full h-full max-h-[70vh] overflow-y-auto py-3 shadow-md bg-transparent border-[2px] rounded-xl flex flex-col gap-3">
						{/* {sortedQuotes.map((quote, index) => (
							<Quote key={index} quote={quote} />
						))} */}
						{loading ? (
                            // Display skeletons when loading
                            Array(6).fill(0).map((_, index) => (
                                <Skeleton key={index} className="scale-90 shadow-md w-full rounded-lg h-28" />
                            ))
                        ) : (
                            // Display quotes when not loading
                            sortedQuotes.map((quote, index) => (
                                <Quote key={index} quote={quote} className={index === 0 ? 'animate-slideInFromTop' : ''} />
                            ))
                        )}
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
