import React, { useState, useEffect } from "react";
import Header from './Header';
import './index.css';
import { Provider } from "/components/ui/provider";
import { Tabs } from "@chakra-ui/react";
import background from './public/background.png';

function App() {
	const [quotes, setQuotes] = useState([]);

	// Fetch quotes from the API
	useEffect(() => {
		fetch('/api/quotes')
		.then(response => response.json())
		.then(data => setQuotes(data))
		.catch(error => console.error('Error fetching quotes:', error));
	}, []);

	return (
		<Provider>
			{/* className="bg-[url('../public/home/background.png')] bg-top bg-cover relative isolate flex-grow min-h-screen px-6 py-14 lg:px-8 items-center flex flex-col" */}
			<div className={`App isolate bg-[url('./public/background.png')] bg-white/70 bg-center bg-cover min-h-dvh flex-grow`}>
				{/* TODO: include an icon for the quote book */}
				<Header />

				<h2>Submit a quote</h2>
				{/* TODO: implement custom form submission logic to not refresh the page */}
				<form action="/api/quote" method="post">
					<label htmlFor="input-name">Name</label>
					<input type="text" name="name" id="input-name" required />
					<label htmlFor="input-message">Quote</label>
					<input type="text" name="message" id="input-message" required />
					<button type="submit">Submit</button>
				</form>

				<h2>Previous Quotes</h2>
				<Tabs.Root defaultValue="all" variant="plain">
					<Tabs.List bg="bg.muted" rounded="l3" p="1">
						<Tabs.Trigger value="all">
							All
						</Tabs.Trigger>
						<Tabs.Trigger value="week">
							Week
						</Tabs.Trigger>
						<Tabs.Trigger value="month">
							Month
						</Tabs.Trigger>
						<Tabs.Trigger value="year">
							Year
						</Tabs.Trigger>
						<Tabs.Indicator rounded="l2" />
					</Tabs.List>

					{/* <Tabs.Content value="all">
						all
					</Tabs.Content>
					<Tabs.Content value="week">
						week
					</Tabs.Content>
					<Tabs.Content value="month">
						month
					</Tabs.Content>
					<Tabs.Content value="year">
						year
					</Tabs.Content> */}
					<Tabs.Content value="all">
						{quotes.map((quote, index) => (
						<div key={index} className="quote">
							<p><strong>{quote.name}</strong></p>
							<p>{quote.message}</p>
						</div>
						))}
					</Tabs.Content>
					{/* Implement filtering logic for week, month, and year if needed */}
				</Tabs.Root>
				{/* TODO: Display the actual quotes from the database */}
				{/* <div className="messages">
					<p>Peter Anteater</p>
					<p>Zot Zot Zot!</p>
					<p>Every day</p>
				</div> */}
			</div>
		</Provider>
	);
}

export default App;
