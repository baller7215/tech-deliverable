import React, { useState, useEffect } from "react";
import Header from './Header';
import './index.css';
import { Provider } from "/components/ui/provider";
// import { Tabs } from "@chakra-ui/react";
import background from './public/background.png';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Quote from './Quote';



/** @todo:
 * add sonner / toast when quotes are added
 * add skeletons for loading quotes
 * implement tabs for filtering all, week, month, year
 */
function App() {
	const [quotes, setQuotes] = useState([]);
	const [selectedTab, setSelectedTab] = useState("all");

	// Fetch quotes from the API based on the selected tab
	useEffect(() => {
		fetch(`/api/quotes?max_age=${selectedTab}#quotes`)
		.then(response => response.json())
		.then(data => setQuotes(data))
		.catch(error => console.error('Error fetching quotes:', error));
	}, [selectedTab]);

	// Function to sort quotes by time
	const sortedQuotes = quotes.sort((a, b) => new Date(b.time) - new Date(a.time));

	return (
		// <Provider>
			<div className={`App isolate bg-[url('./public/background.png')] bg-white/70 bg-center bg-cover min-h-dvh flex-grow`}>
				{/* TODO: include an icon for the quote book */}
				<Header />

				<div className="w-full h-[75vh] py-10">
					<h2>Submit a quote</h2>
					{/* TODO: implement custom form submission logic to not refresh the page */}
					<form action="/api/quote#quotes" method="post" className="max-w-[500px] flex flex-col gap-2">
						<label htmlFor="input-name">Name</label>
						<input type="text" name="name" id="input-name" required />
						<label htmlFor="input-message">Quote</label>
						<input type="text" name="message" id="input-message" required />
						<button type="submit">Submit</button>
					</form>
				</div>

				<div className="w-full h-auto" id="quotes">
					<h2>Previous Quotes</h2>
					<Tabs defaultValue="all" className="w-full min-w-full" onValueChange={setSelectedTab}>
						<TabsList>
							<TabsTrigger value="all">All</TabsTrigger>
							<TabsTrigger value="week">Week</TabsTrigger>
							<TabsTrigger value="month">Month</TabsTrigger>
							<TabsTrigger value="year">Year</TabsTrigger>
						</TabsList>
						<TabsContent value="all">
							<div className="w-full flex flex-col gap-3">
								{selectedTab === "all" && sortedQuotes.map((quote, index) => (
									<Quote key={index} quote={quote} />
								))}
							</div>

						</TabsContent>
						<TabsContent value="week">
							{selectedTab === "week" && sortedQuotes.map((quote, index) => (
							<div key={index} className="quote">
								<p><strong>{quote.name}</strong></p>
								<p>{quote.message}</p>
							</div>
							))}
						</TabsContent>
						<TabsContent value="month">
							{selectedTab === "month" && sortedQuotes.map((quote, index) => (
							<div key={index} className="quote">
								<p><strong>{quote.name}</strong></p>
								<p>{quote.message}</p>
							</div>
							))}
						</TabsContent>
						<TabsContent value="year">
							{selectedTab === "year" && sortedQuotes.map((quote, index) => (
							<div key={index} className="quote">
								<p><strong>{quote.name}</strong></p>
								<p>{quote.message}</p>
							</div>
							))}
						</TabsContent>
					</Tabs>
				</div>
			</div>
		// </Provider>
	);
}

export default App;
