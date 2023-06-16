import './App.css';
import TopBar from './TopBar';
import BottomBar from './BottomBar';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import FoodCategories from './components/FoodCategories';
import Home from './components/Home';
import Metadata from './components/Metadata';

const App = () => {
  return (
    <div>
      <Router>
        <TopBar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/food-categories" component={FoodCategories} />
          <Route exact path="/metadata" component={Metadata} />
          <Redirect to="/" />
        </Switch>
        <BottomBar />
      </Router>
    </div>
  )
}

export default App
