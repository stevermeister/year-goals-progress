import './App.css';
import ProgressBar from './ProgressBar';

function App() {  

  const goals = [
    { title: 'Visit a new country', start: 0, goal: 2},
    { title: 'Visit a new city', start: 0, goal: 20},
    { title: 'Visit a new place', start: 0, goal: 20},
    { title: 'Swim in the sea', start: 0, goal: 2},
    { title: 'Read book', start: 0, goal: 25},
    { title: 'Listen audiobook', start: 0, goal: 10},
    { title: 'Watch film', start: 0, goal: 20},
    { title: 'Get weight', start: 65, goal: 75},
    { title: 'Conference talk', start: 0, goal: 4},
    { title: 'Angular Meetup', start: 0, goal: 3},
    { title: 'Chess raiting', start: 1800, goal: 2100},
    { title: 'Gym', start: 0, goal: 100},
    { title: 'Visit NL museum', start: 0, goal: 10},
    { title: 'Restaurant', start: 0, goal: 12},
  ];

  const statusNumber = {
    'Visit a new country' : 0,
    'Visit a new city' : 2,
    'Visit a new place': 1,
    'Swim in the sea' : 0,
    'Read book' : 1,
    'Listen audiobook' : 0,
    'Watch film' : 2,
    'Get weight' : 65,
    'Conference talk' : 0,
    'Angular Meetup' : 0,
    'Chess raiting' : 1850,
    'Gym' : 16,
    'Visit NL museum': 2,
    'Restaurant': 4
  }

  /* LOG:
  - gym 1
  - gym 2
  - gym 3
  - city - Hilversum 9.01
  - book - Беседы с сократом - 9.01
  - film - Interviewing vampire - 8.01
  - museum - van Gogh (Klimt) - 8.01
  - gym 4
  - gym 5 - 13.01
  - museum - 14.01
  - Restaurant - 14.01
  - gym 6 - 21.01
  - gym 7 - 22.01
  - gym 8 - 24.01
  - gym 9 - 29.01
  - gym 10 - 30.01
  - gym 11 - 1.02
  - gym 12 - 5.02
  - gym 13 - 9.02
  - gym 14 - 11.02
  - new city - 2 - Huisen - 12.02
  - new place - 1 - Fletcher Hotel region at  Huisen - 12.02
  - gym 15 - 14.02
  - Restaurant - Gary Loen - 2 - 10.02
  - gym 16 - 16.02
  - Restaurant - Bono - .02
  - Restaurant - Kusadasi - 4.03
  - Watch film - Glass onion - 2 - 10.03


  */
  


    return (
      <div className="container">
        <h1>Goals progress</h1>

        <ul>
          {goals.map((goal, index) => (
            <li>{goal.title}: <ProgressBar start={goal.start} goal={goal.goal} number={statusNumber[goal.title]}/></li>
          ))}
        </ul>

      </div>
    )
}

export default App;