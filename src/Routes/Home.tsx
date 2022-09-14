import {useState} from 'react';
import {useQuery} from '@tanstack/react-query'
import {motion, AnimatePresence} from 'framer-motion'
import {getMovies, IGetMoviesResult} from '../api'
import styled from 'styled-components'
import { makeImagePath } from '../utils'
import { useNavigate,useMatch } from 'react-router-dom';


const Wrapper = styled.div`
background-color:balck
`

const Loader = styled.div`
    height:20vh; 
    display:flex;
    justify-content:center;
    align-items:center;
`
const Banner= styled.div<{bgPhoto:string}>`
    height: 100vh;
    display:flex;
    flex-direction:column;
    color:white;
    justify-content:center;
    padding : 60px;
    background-image: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${props=> props.bgPhoto});
    
`
const Title = styled.h2`
    font-size: 60px;
    margin-bottom: 15px;
`
const Overview = styled.p`
    font-size: 20px;
    margin-top: 0;
    width: 50%;

`

const Slider = styled(motion.div)`
    position:relative;
    bottom:0
`
const Row = styled(motion.div)`
    display : grid;
    gap : 10px;
    grid-template-columns: repeat(6, 1fr);
    margin-bottom:5px;
    position: relative;
 
`

const Box = styled(motion.div)<{bgPhoto:string}>`
    background-color:white;
    height: 200px;
    background-image: url(${props=> props.bgPhoto});
    background-size:cover;
    background-position:center center;
    position:relative;
    &:first-child {
        transform-origin : center left;
    }
    &:last-child {
        transform-origin:center right
    }

`

const Info = styled(motion.div)`
    margin: 0;
    color:white;
    background-color: ${props=> props.theme.black.lighter};
    opacity: 0;
    position :absolute;
    bottom:0%;
    h4 {
        text-align:center;
        font-size: 18px
    };
    width:100%;
`

const infoVariants = {
    hover: {
        opacity:1,
        backgroundColor: "#0000003b",
    }
}

const boxVariants ={
        normal: {scale:1},
        hover : {
                zIndex:99,
                y:-50,
                scale:1.3,
                transition : {delay:0.5, type:'tween'},
                
            }
}

    const rowVariants = {
        hidden:{
            x: window.outerWidth + 10,
        },
        visible:{
            x:0
        },
        exit:{
            x:-window.outerWidth - 10
        }
    }
const offset = 6;

function Home(){
    const navigate = useNavigate();
    const bigMovieMatch = useMatch('/movie/:id');
    console.log(bigMovieMatch);
    const {data, isLoading} = useQuery<IGetMoviesResult>(['movies', 'nowPlaying'], getMovies)
    const [index, setIndex] = useState(0)
    const increaseIndex = () => {
        if(data){
        if(leaving) {return};
        toggleLeaving();
        const totlaMovies = data?.results.length -1;
        const maxIndex = Math.floor(totlaMovies/ offset) -1;
        setIndex(prev=> prev===maxIndex? 0:prev+1)};}
    const toggleLeaving =() => setLeaving(prev => !prev);
    const onBoxClicked = (movieId:number) => {
        navigate(`/movie/${movieId}`)

    }
    const [leaving, setLeaving] = useState(false)
    

    return (
        <Wrapper>
        {isLoading ? <Loader>Loading..</Loader> : <>
                                                    <Banner onClick={increaseIndex} bgPhoto={makeImagePath(data?.results[0].backdrop_path || '')}>
                                                        <Title>{data?.results[0].title}</Title>
                                                        <Overview>{data?.results[0].overview}</Overview>

                                                    </Banner>
                                                    <Slider>
                                                        <AnimatePresence  initial={false} onExitComplete={toggleLeaving}>
                                                        <Row variants={rowVariants} key={index} transition={{type:'tween', duration:1}} initial='hidden' animate='visible' exit='exit'>
                                                        {data?.results
                                                            .slice(1)
                                                            .slice(offset*index, offset*index + offset)
                                                            .map(movie => <Box
                                                                            layoutId={movie.id+''}
                                                                            variants={boxVariants}
                                                                             whileHover= 'hover'
                                                                             initial='normal'
                                                                             transition={{type:'tween'}}
                                                                             key={movie.id} 
                                                                             bgPhoto={makeImagePath(movie.backdrop_path, 'w500')}
                                                                             onClick={()=> onBoxClicked(movie.id)}
                                                                             >

                                                                             
                                                                             <Info variants={infoVariants}><h4>{movie.title}</h4></Info>
                                                                                

                                                                            </Box>
                                                                             )}
                                                            
                                                            
                                                        </Row>
                                                        </AnimatePresence>
                                                    </Slider>
                                                    <AnimatePresence>
                                                                {bigMovieMatch ? <motion.div
                                                                    layoutId={bigMovieMatch.params.id}
                                                                     style ={{
                                                                    position:'absolute',
                                                                    width: '40%',
                                                                    height: '50%',
                                                                    backgroundColor:'red',
                                                                    top: '60%',
                                                                    left:0,
                                                                    margin: 'auto',
                                                                    right :0,
                                                                    
                                                                }}/> : null}
                                                    </AnimatePresence>
                                                </>}
        </Wrapper>
    );
}

export default Home