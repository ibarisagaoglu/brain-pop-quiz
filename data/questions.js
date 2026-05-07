const questions = [
  { id: 1, category: 'Animals', question: 'What is the fastest land animal?', emoji: '🐆', options: ['Lion', 'Cheetah', 'Horse', 'Leopard'], answer: 'Cheetah' },
  { id: 2, category: 'Animals', question: 'Which animal is known as the King of the Jungle?', emoji: '🦁', options: ['Tiger', 'Elephant', 'Lion', 'Bear'], answer: 'Lion' },
  { id: 3, category: 'Animals', question: 'What do pandas mainly eat?', emoji: '🐼', options: ['Fish', 'Bamboo', 'Grass', 'Leaves'], answer: 'Bamboo' },
  { id: 4, category: 'Animals', question: 'Which animal can live both in water and on land?', emoji: '🐸', options: ['Eagle', 'Frog', 'Camel', 'Rabbit'], answer: 'Frog' },
  { id: 5, category: 'Animals', question: 'How many legs does a spider have?', emoji: '🕷️', options: ['6', '8', '10', '4'], answer: '8' },

  { id: 6, category: 'Science', question: 'What planet is known as the Red Planet?', emoji: '🪐', options: ['Earth', 'Venus', 'Mars', 'Jupiter'], answer: 'Mars' },
  { id: 7, category: 'Science', question: 'What gas do plants need to grow?', emoji: '🌿', options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Helium'], answer: 'Carbon Dioxide' },
  { id: 8, category: 'Science', question: 'What is H2O commonly called?', emoji: '💧', options: ['Salt', 'Water', 'Hydrogen', 'Steam'], answer: 'Water' },
  { id: 9, category: 'Science', question: 'Which part of the body helps you think?', emoji: '🧠', options: ['Heart', 'Lungs', 'Brain', 'Stomach'], answer: 'Brain' },
  { id: 10, category: 'Science', question: 'What force pulls things toward Earth?', emoji: '🍎', options: ['Magnetism', 'Gravity', 'Wind', 'Friction'], answer: 'Gravity' },

  { id: 11, category: 'Geography', question: 'Which is the largest ocean?', emoji: '🌊', options: ['Atlantic', 'Indian', 'Pacific', 'Arctic'], answer: 'Pacific' },
  { id: 12, category: 'Geography', question: 'What is the capital of France?', emoji: '🗼', options: ['Rome', 'Berlin', 'Paris', 'Madrid'], answer: 'Paris' },
  { id: 13, category: 'Geography', question: 'Which continent is Egypt in?', emoji: '🏜️', options: ['Asia', 'Europe', 'Africa', 'South America'], answer: 'Africa' },
  { id: 14, category: 'Geography', question: 'Mount Everest is in which mountain range?', emoji: '🏔️', options: ['Andes', 'Himalayas', 'Alps', 'Rockies'], answer: 'Himalayas' },
  { id: 15, category: 'Geography', question: 'Which country is shaped like a boot?', emoji: '🥾', options: ['Spain', 'Italy', 'Greece', 'Portugal'], answer: 'Italy' },

  { id: 16, category: 'Sports', question: 'How many players are on a soccer team on the field?', emoji: '⚽', options: ['9', '10', '11', '12'], answer: '11' },
  { id: 17, category: 'Sports', question: 'Which sport uses a racket and shuttlecock?', emoji: '🏸', options: ['Tennis', 'Badminton', 'Squash', 'Table Tennis'], answer: 'Badminton' },
  { id: 18, category: 'Sports', question: 'In basketball, how many points is a free throw?', emoji: '🏀', options: ['1', '2', '3', '4'], answer: '1' },
  { id: 19, category: 'Sports', question: 'Which country hosted the 2016 Summer Olympics?', emoji: '🥇', options: ['China', 'Brazil', 'Japan', 'UK'], answer: 'Brazil' },
  { id: 20, category: 'Sports', question: 'What color card means a player is sent off in soccer?', emoji: '🟥', options: ['Yellow', 'Blue', 'Red', 'Green'], answer: 'Red' },

  { id: 21, category: 'Food', question: 'Which fruit is yellow and curved?', emoji: '🍌', options: ['Apple', 'Banana', 'Pear', 'Peach'], answer: 'Banana' },
  { id: 22, category: 'Food', question: 'What do bees make?', emoji: '🍯', options: ['Milk', 'Honey', 'Jam', 'Butter'], answer: 'Honey' },
  { id: 23, category: 'Food', question: 'Which food is made from milk?', emoji: '🧀', options: ['Bread', 'Cheese', 'Rice', 'Pasta'], answer: 'Cheese' },
  { id: 24, category: 'Food', question: 'Sushi is a famous food from which country?', emoji: '🍣', options: ['Italy', 'Mexico', 'Japan', 'India'], answer: 'Japan' },
  { id: 25, category: 'Food', question: 'Which vegetable is orange?', emoji: '🥕', options: ['Potato', 'Carrot', 'Cucumber', 'Onion'], answer: 'Carrot' },

  { id: 26, category: 'History', question: 'Who was the first person on the Moon?', emoji: '🌕', options: ['Yuri Gagarin', 'Buzz Aldrin', 'Neil Armstrong', 'Alan Shepard'], answer: 'Neil Armstrong' },
  { id: 27, category: 'History', question: 'Which ancient civilization built pyramids?', emoji: '🔺', options: ['Romans', 'Egyptians', 'Vikings', 'Mayans'], answer: 'Egyptians' },
  { id: 28, category: 'History', question: 'In which country did the Olympic Games begin?', emoji: '🏛️', options: ['Italy', 'Greece', 'Turkey', 'France'], answer: 'Greece' },
  { id: 29, category: 'History', question: 'Who invented the light bulb?', emoji: '💡', options: ['Isaac Newton', 'Thomas Edison', 'Albert Einstein', 'Galileo'], answer: 'Thomas Edison' },
  { id: 30, category: 'History', question: 'Which wall fell in 1989 in Germany?', emoji: '🧱', options: ['Great Wall', 'Berlin Wall', 'Hadrian\'s Wall', 'Wailing Wall'], answer: 'Berlin Wall' }
];

export default questions;
