import './App.css';
import ProgressBar from './ProgressBar';

function App() {  

  const goals = [
    { title: 'Visit a new country', start: 0, goal: 2},
    { title: 'Swim in the sea', start: 0, goal: 2},
    { title: 'Read book', start: 0, goal: 25},
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
    'Visit a new country' : 2,
    'Swim in the sea' : 1,
    'Read book' : 4,
    'Watch film' : 2,
    'Get weight' : 65,
    'Conference talk' : 1,
    'Angular Meetup' : 0,
    'Chess raiting' : 2030,
    'Gym' : 57,
    'Visit NL museum': 3,
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
  - gym 17 - 13.03
  - chess up 1900 - 15.03
  - Visit NL museum - Royal Palace Amsterdam - 18.03
  - book - The Strange Journey of Mr Daldry, Marc Levy - 7.04
  - city - Enkhuizen, Urk, Harderwijk
  - gym 18 - 8.05
  - gym 19 - 24.06
  - gym 20 - 26.06
  - gym 21 - 27.06
  - gym 22 - 29.06
  - gym 23 - 30.06
  - gym 24 - 4.07
  - gym 25 - 6.07
  - gym 26 - 11.07
  - gym 27 - 15.07
  - gym 28 - 16.07
  - gym 29 - 17.07
  - gym 30 - 20.07
  - gym 31 - 1.08
  - gym 32 - 3.08
  - gym 33 - 8.08
  - gym 34 - 10.08
  - gym 35 - 17.08
  - gym 36 - 28.08
  - gym 37 - 29.08
  - gym 38 - 23.09
  - gym 39 - 30.09
  - gym 40 - 3.10
  - gym 41 - 10.10
  - gym 42 - 12.10
  - gym 43 - 15.10
  - gym 44 - 17.10
  - gym 45 - 23.10
  - gym 46 - 24.10
  - gym 47 - 26.10
  - gym 48 - 29.10
  - gym 49 - 31.10
  - gym 50 - 1.11
  - gym 51 - 7.11
  - gym 52 - 15.11
  - gym 53 - 16.11
  - gym 54 - 29.11
  - gym 55 - 4.12
  - gym 56 - 5.12
  - gym 57 - 27.12
  - book - Выбор
  - book - Когда Ницше плакал
  - book - Все мы творения на день
  - book - бхагавад гита
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