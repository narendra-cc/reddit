import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

class App extends Component {
  state = {
    posts: []
  }

  componentDidMount() {
    axios.get(`https://www.reddit.com/.json`)
      .then(res => {
        console.log(res, res.data);
        const posts = res.data.data.children;
        this.setState({ posts });
      }).then(
        setTimeout(this.sayHi, 1000)
      ).then(
        setTimeout(this.sayHi1, 2000)
      )
  }
  sayHi = () => {
    axios.get(`https://www.reddit.com/.json?after=t3_9ln23f`)
      .then(res => {
        console.log(res, res.data);
        const posts1 = res.data.data.children;
        this.setState({ 
          posts : [...this.state.posts, ...posts1] 
        });
      })
  }
  sayHi1 = () => {
    axios.get(`https://www.reddit.com/.json?after=t3_9lp7px`)
      .then(res => {
        console.log(res, res.data);
        const posts1 = res.data.data.children;
        this.setState({ 
          posts : [...this.state.posts, ...posts1] 
        });
      })
  }

   

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>Reddit</p>
        </header>
        <div>
          { this.state.posts.map(post => 
            <li>
              <div className="voting">
                <i className="fa fa-arrow-up"/>
                <div className="score">{post.data.score}</div>
                <i className="fa fa-arrow-down"/>
              </div>
              <img className="thumbnail"
                alt="thumbnail"
                src={post.data.thumbnail} />
              <a href={post.data.url}>{post.data.title}</a>  
              ({post.data.domain})  
              <span>{post.data.num_comments} Comments</span>  
              <span>Submitted By: {post.data.author} </span>  
              <span>Score: {post.data.score} </span> 
              <span>Upvotes: {post.data.ups} </span> 
              {/* <img 
                alt="thumbnail"
                src={post.data.thumbnail} /> */}
                {/* <img 
                alt="thumbnail"
                src={post.data.preview.images[0].source.url} /> */}
            </li>
          )}
          <hr/>
          
        </div>  
      </div>
    );
  }
}

export default App;
