import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import axios from 'axios'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)



  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => navigate('/')
  const redirectToArticles = () =>  navigate('/articles')

  const logout = () => {
    localStorage.removeItem ('token')
      setMessage('Goodbye!')
      redirectToLogin()
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
  }
  const login = async ({ username, password }) => {
    setMessage('')
    setSpinnerOn(true)
  
    try {
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
  
      const data = await response.json()
    
  
      setSpinnerOn(false)
  
      if (response.ok) {
        localStorage.setItem('token', data.token)
        setMessage('Login successful!')
        redirectToArticles()
      }
    } catch (err) {
      console.error(err)
      setSpinnerOn(false)
      setMessage('Login failed')
    }
  }
  
  // const login = ({ username, password }) => {
  //   setMessage('')
  //   setSpinnerOn(true)

  //   try {
  //     const response = async (loginUrl, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ username, password })
  //     })

  //     const data = response.json()
  //     console.log(response)

  //     setSpinnerOn(false)

  //     if (response.ok) {
  //       localStorage.setItem('token', data.token)
  //       setMessage('Login successful!')
  //       redirectToArticles()
  //     } else {
  //       setMessage(data.message || 'Login failed')
  //     }
  //   } catch (error) {
  //     setSpinnerOn(false)
  //     setMessage('An error occurred. Please try again.')
  //   }
  // }

    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
  

  const getArticles = async () => {
    setMessage('')
    setSpinnerOn(true)

    const token = localStorage.getItem('token')

    if (!token) {
      redirectToLogin()
      return
    }

    try {
      const response =  await fetch(articlesUrl, {
        method: 'GET',
        headers: {
          'Authorization': `${token}`
        }
      })

      console.log (localStorage.getItem('token'))

      const data = await response.json()
      console.log(data)
      

      setSpinnerOn(false)

      if (response.ok) {
        setArticles(data.articles)
        setMessage('Articles loaded successfully.')
      } else if (response.status === 401) {
        redirectToLogin()
      } else {
        setMessage('Failed to load articles.')
      }
    } catch (error) {
      setSpinnerOn(false)
      setMessage('An error occurred while fetching articles.')
    }
    
  }
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
  

  const postArticle = (article) => {
    setMessage('')
    setSpinnerOn(true)

    const token = localStorage.getItem('token')

    axios
      .post(articlesUrl, article, {
        headers: {
          Authorization:token,
        },
      })
      .then ((res)=> {
        setArticles([...articles,res.data.article])
        setMessage(res.data.message)
      } )
      .catch((err) => {
        console.error(err)
        setMessage("fail to post article")
      }) 
      .finally (()=> {
        setSpinnerOn(false)
      })
      }
  
  //     setMessage('')
  //     setSpinnerOn (true)
  
  //     const token = localStorage.getItem ('token')
  
  //       if (!token){
  //         redirectToLogin()
  //         return
  //       }
  //       try {
  //         const response = await fetch(articlesUrl, {
  //           method: 'POST',
  //           headers: {
  //             'Content-Type': 'application/json',
  //             'Authorization': `Bearer ${token}`
  //           },
  //           body: JSON.stringify(article)
  //         })
    
  //         const data = await response.json()
    
  //         setSpinnerOn(false)
    
  //         if (response.ok) {
  //           setMessage('Article created successfully!')
  //           getArticles()  // Refresh the articles list
  //         } else {
  //           setMessage(data.message || 'Failed to create article.')
  //         }
  //       } catch (error) {
  //         setSpinnerOn(false)
  //         setMessage('An error occurred while posting article.')
  //       }
      
  // }

  const updateArticle =  ({article_id, article}) => {
    setMessage("");
		setSpinnerOn(true);

		const token = localStorage.getItem("token");

		axios
			.put(`${articlesUrl}/${article_id}`, article, {
				headers: {
					Authorization: token,
				},
			})
			.then((res) => {
				setArticles(
					articles.map((a) =>
						a.article_id === article_id ? res.data.article : a
					)
				);
				setMessage(res.data.message);
				setCurrentArticleId(null);
			})
			.catch((err) => {
				console.error(err);
				setMessage("Failed to update article.");
			})
			.finally(() => setSpinnerOn(false));
	};

  //   setMessage('')
  //   setSpinnerOn(true)

  //   const token = localStorage.getItem('token')

  //   if (!token) {
  //     redirectToLogin()
  //     return
  //   }

  //   try {
  //     const response = await fetch (`${articlesUrl}/${article_id}`, {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${token}`
  //       },
  //       body: JSON.stringify(article)
  //     })

  //     const data = await response.json()

  //     setSpinnerOn(false)

  //     if (response.ok) {
  //       setMessage('Article updated successfully!')
  //       getArticles()  // Refresh the articles list
  //     } else {
  //       setMessage(data.message || 'Failed to update article.')
  //     }
  //   } catch (error) {
  //     setSpinnerOn(false)
  //     setMessage('An error occurred while updating article.')
  //   }
  // }

  const deleteArticle =  (article_id) => {
    setMessage("");
		setSpinnerOn(true);

		const token = localStorage.getItem("token");

		axios
			.delete(`${articlesUrl}/${article_id}`, {
				headers: {
					Authorization: token,
				},
			})
			.then((res) => {
				setArticles(articles.filter((a) => a.article_id !== article_id));
				setMessage(res.data.message);
			})
			.catch((err) => {
				console.error(err);
				setMessage("Failed to delete article.");
			})
			.finally(() => setSpinnerOn(false));
	};
  //   setMessage('')
  //   setSpinnerOn(true)

  //   const token = localStorage.getItem('token')

  //   if (!token) {
  //     redirectToLogin()
  //     return
  //   }

  //   try {
  //     const response = await fetch(`${articlesUrl}/${article_id}`, {
  //       method: 'DELETE',
  //       headers: {
  //         'Authorization': `Bearer ${token}`
  //       }
  //     })

  //     const data = await response.json()

  //     setSpinnerOn(false)

  //     if (response.ok) {
  //       setMessage('Article deleted successfully!')
  //       getArticles()  // Refresh the articles list
  //     } else {
  //       setMessage(data.message || 'Failed to delete article.')
  //     }
  //   } catch (error) {
  //     setSpinnerOn(false)
  //     setMessage('An error occurred while deleting article.')
  //   }
  // }
 

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner />
      <Message message={message}/>
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm
          login ={login} />} />
          <Route  path="articles" element={
            <>
              <ArticleForm 
              currentArticle={articles.find(
                (article) => currentArticleId === article.article_id
              )}
              setCurrentArticleId={setCurrentArticleId}
              postArticle={postArticle} 
              updateArticle={updateArticle} 
            />
              <Articles 
              currentArticleId={currentArticleId}
              getArticles ={getArticles} 
              articles={articles}
              deleteArticle={deleteArticle}
              setCurrentArticleId={setCurrentArticleId}
              />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2024</footer>
      </div>
    </>
  )
}
