import React from "react";
import { Home } from "./pages/Home";

import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Room } from "./pages/Room";
import { PlayerContextProvider } from "./contexts/Player";

function App() {
	return (
		<BrowserRouter>
			<PlayerContextProvider>
				{/* O switch é pra garantir que ele só vai renderizar uma rota */}
				<Switch>
					{/* O exact é pra garantir que tem que acessar exatamente aquela URL, pq se nao ele vai renderizar todas as rotas que CONTÉM auqele começo (/ e /rooms) */}
					<Route path="/" exact={true} component={Home}></Route>
					<Route path="/rooms/:id" component={Room}></Route>
				</Switch>
			</PlayerContextProvider>
		</BrowserRouter>
	);
}

export default App;