import ProgressBar from './ProgressBar'
import './App.css'

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
    'Read book' : 6,
    'Watch film' : 2,
    'Get weight' : 65,
    'Conference talk' : 1,
    'Angular Meetup' : 0,
    'Chess raiting' : 2030,
    'Gym' : 57,
    'Visit NL museum': 3,
    'Restaurant': 4
  }

  return (
    <div className="App">
      <h1>Year Goals Progress</h1>
      <div className="goals-container">
        {goals.map((goal) => (
          <div key={goal.title} className="goal-item">
            <h3>{goal.title}</h3>
            <ProgressBar 
              start={goal.start}
              current={statusNumber[goal.title]}
              goal={goal.goal}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App
