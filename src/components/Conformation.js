import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { baseUrl } from '../baseUrl'

function Conformation({match}) {
    const [msg, setMsg] = useState('')
    const [err, setErr] = useState(false)
    const url = baseUrl + 'confirmEmail/' + match.params.token
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if(data.success) setMsg(data.status)
            else{ setErr(true); setMsg(data.message) }
        })
        .catch(err => {setErr(true); setMsg(err.message)})
    return (
        <div>
            <div style={{ position: 'absolute', top:0, height: '100vh', width: '100vw', background: `url('/images/email.png') center center fixed`}}>
                
            </div>
            <div style={{ position: 'absolute', top:'15vh', left: '50vw', transform: 'translateX(-50%)'}}>
            <h2>{err? 'Something went wrong':'Thank you for being part of our blog'}</h2>
            <h4 style={{textAlign: 'center', textTransform: 'capitalize'}}>{msg}</h4> 
            {err && <p>You can send another link by going to register page</p>}
            <h5 style={{textAlign: 'center'}}><Link to="/" className="btn btn-primary">Go to homepage</Link></h5> 
            </div>
        </div>
    )
}

export default Conformation
