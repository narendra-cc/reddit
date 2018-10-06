let Voting = ({ post, onUpvote, onDownvote }) => (
  <div className="voting">
    <i className="fa fa-arrow-up" onClick={onUpvote}/>
    <div className="score">{post.score}</div>
    <i className="fa fa-arrow-down" onClick={onDownvote}/>
  </div>
);
Voting.propTypes = {
  post: React.PropTypes.object.isRequired,
  onUpvote: React.PropTypes.func.isRequired,
  onDownvote: React.PropTypes.func.isRequired
};

class Time extends React.Component {
  constructor(props) {
    super(props);
    this.computeTimeString = this.computeTimeString.bind(this);
  }

  computeTimeString() {
    let theMoment;
    if(this.props.isUnixTime) {
      theMoment = moment.unix(this.props.time);
    } else {
      theMoment = moment(this.props.time);
    }

    return theMoment.fromNow();
  }

  render() {
    return (
      <span className="time">{this.computeTimeString()}</span>
    );
  }
}
Time.propTypes = {
  time: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number
  ]).isRequired,
  isUnixTime: React.PropTypes.bool
};

let Thumbnail = ({post}) => {
  if(post.is_self) {
    return <a className="thumbnail self"/>
  } else if(post.thumbnail === 'default') {
    return <a className="thumbnail default"/>
  } else {
    return (
      <img className="thumbnail"
        alt="thumbnail"
        src={post.thumbnail} />
    );
  }
};
Thumbnail.propTypes = {
  post: React.PropTypes.object.isRequired
};

class RedditPost extends React.Component {
  static propTypes = {
    post: React.PropTypes.object.isRequired,
    onUpvote: React.PropTypes.func.isRequired,
    onDownvote: React.PropTypes.func.isRequired
  };

  handleUpvoteClick = () => {
    this.props.onUpvote(this.props.post.id);
  };

  handleDownvoteClick = () => {
    this.props.onDownvote(this.props.post.id);
  };

  render() {
    let {post} = this.props;

    return (
      <div className="reddit-post">
        <Voting post={post}
          onUpvote={this.handleUpvoteClick}
          onDownvote={this.handleDownvoteClick} />
        <Thumbnail post={post}/>
        <div className="content">
          <h3 className="title">
            <a href={post.url}>{post.title}</a>
          </h3>
          <div className="submitted">
            Submitted <Time time={post.created} isUnixTime={true}/>
          </div>
          <a className="comments" href={`https://www.reddit.com${post.permalink}`}>
            {post.num_comments} comments
          </a>
          <span className="action">share</span>
          <span className="action">save</span>
          <span className="action">hide</span>
        </div>
      </div>
    )
  }
}

class RedditListing extends React.Component {
  static propTypes = {
    posts: React.PropTypes.array.isRequired,
    onUpvote: React.PropTypes.func.isRequired,
    onDownvote: React.PropTypes.func.isRequired
  };

  render() {
    let {posts, onUpvote, onDownvote} = this.props;

    return (
      <ul className="reddit-listing">
        {posts
          .sort((p1, p2) =>
            p2.score - p1.score
          ).map(post =>
            <li key={post.id}>
              <RedditPost post={post}
                onUpvote={onUpvote}
                onDownvote={onDownvote} />
            </li>
        )}
      </ul>
    )
  }
}

class Reddit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: {}
    };
  }

  componentDidMount() {
    // To use static data, uncomment this line:
    this.processPosts(reactjsPosts.data.children);

    /*To fetch live data from Reddit, use this block of code:
    fetch('http://www.reddit.com/r/reactjs.json')
      .then(response =>
        response.json().then(json => ({json, response}))
     let posts = json.data.children;
       this.processPosts(posts);
     })
      .catch(err => console.log(err));*/
  }

  processPosts = (posts) => {
    // Make the data nicer to work with
    let postsHash = posts.reduce((hash, post) => {
      hash[post.data.id] = post.data;
      return hash;
    }, {});

    this.setState({
      posts: postsHash
    });
  };

  handleUpvote = (postId) => {
    // Immutably update the post:
    this.setState({
      // Set 'posts' to...
      posts: {
        // Every existing post, but then...
        ...this.state.posts,
        // Replace the one at 'postId' with...
        [postId]: {
          // All the keys/values it originally had, but...
          ...this.state.posts[postId],
          // Replace its 'score' with a new value
          score: this.state.posts[postId].score + 1
        }
      }
    });
  };

  handleDownvote = (postId) => {
    // Immutably update the post:
    this.setState({
      // Set 'posts' to...
      posts: {
        // Every existing post, but then...
        ...this.state.posts,
        // Replace the one at 'postId' with...
        [postId]: {
          // All the keys/values it originally had, but...
          ...this.state.posts[postId],
          // Replace its 'score' with a new value
          score: this.state.posts[postId].score - 1
        }
      }
    });
  };

  render() {
    return (
      <RedditListing
        posts={Object.keys(this.state.posts).map(id => this.state.posts[id])}
        onUpvote={this.handleUpvote}
        onDownvote={this.handleDownvote} />
    );
  }
}

ReactDOM.render(
    <Reddit/>,
    document.querySelector('#root')
);