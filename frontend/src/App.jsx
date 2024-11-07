import React, { useState, useEffect } from "react";
import axios from 'axios';
import Header from './Header';
import './index.css';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Quote from './Quote';



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

	// fetch quotes from the API based on the selected tab
	useEffect(() => {
		fetchQuotes(selectedTab);
	}, [selectedTab]);

	// method to fetch quotes
	const fetchQuotes = async (selectedTab) => {
		try {
			console.log('fetching quotes now');
			const response = await axios.get(`/api/quotes?max_age=${selectedTab}`);
			setQuotes(response.data);
			const sorted = response.data.sort((a, b) => new Date(b.time) - new Date(a.time));
			setSortedQuotes(sorted);
			console.log('updated quotes\n', sortedQuotes);
		} catch (error) {
			console.error('Error fetching quotes:', error);
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
		} catch (error) {
			console.error('Error submitting quote:', error);
		}
	}

	const handleTabChange = (tab) => {
		// event.preventDefault();
        setSelectedTab(tab);
    };

	return (
		<div className={`App relative isolate bg-[url('./public/background.png')] bg-white/70 bg-center bg-cover bg-fixed min-h-dvh flex-grow`}>
			{/* TODO: include an icon for the quote book */}
			<Header />

			<div className="max-w-[800px] w-full h-[75vh] py-10 bg-black/30 mx-auto my-auto justify-center">
				<div className="max-w-[500px] h-full m-auto flex flex-col justify-center gap-2">
					<h2 className="text-center">Submit a quote</h2>
					{/* TODO: implement custom form submission logic to not refresh the page */}
					<form onSubmit={handleSubmit} className="w-full flex flex-col gap-2">
						<label htmlFor="input-name">Name</label>
						<input
							type="text"
							name="name"
							id="input-name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
						/>
						<label htmlFor="input-message">Quote</label>
						<input
							type="text"
							name="message"
							id="input-message"
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							required />
						<button type="submit">Submit</button>
					</form>
				</div>
			</div>

			<a href="#quotes">Click me</a>

			<div className="w-full h-auto" id="quotes">
				<h2>Previous Quotes</h2>

				<div className="h-auto w-full min-w-full flex flex-row justify-between place-items-center gap-3">
					{['all', 'week', 'month', 'year'].map(((value) => {
						return (
							<button
								key={value}
								onClick={() => setSelectedTab(value)}
								className="lowercase"
							>
								{value}
							</button>
						)
					}))}
				</div>

				<div className="w-full min-w-full">
					{sortedQuotes.map((quote, index) => (
						<Quote key={index} quote={quote} />
					))}
				</div>
			</div>
		</div>
	);
}

export default App;
