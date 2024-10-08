import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  // Fetch all todos on component mount
  useEffect(() => {
    axios.get('http://localhost:5000/todos').then((response) => {
      setTodos(response.data);
    });
  }, []);

  // Add a new todo
  const addTodo = () => {
    if (newTodo) {
      axios
        .post('http://localhost:5000/todos', { task: newTodo, completed: false })
        .then(() => {
          setTodos([...todos, { task: newTodo, completed: false }]);
          setNewTodo('');
        });
    }
  };

  // Delete a todo
  const deleteTodo = (id) => {
    axios.delete(`http://localhost:5000/todos/${id}`).then(() => {
      setTodos(todos.filter((todo) => todo.id !== id));
    });
  };

  // Toggle todo completion
  const toggleTodo = (id, completed) => {
    axios
      .put(`http://localhost:5000/todos/${id}`, { completed: !completed })
      .then(() => {
        setTodos(
          todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !completed } : todo
          )
        );
      });
  };

  return (
    <div className="App">
      <h1>Todo List</h1>
      <div className="input-section">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button onClick={addTodo}>Add Todo</button>
      </div>
      <div className="todo-list">
        {todos.map((todo) => (
          <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            <span onClick={() => toggleTodo(todo.id, todo.completed)}>{todo.task}</span>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
