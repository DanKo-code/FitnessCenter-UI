import sad_doing_abonnements_card from "../../../images/sad_doing_abonnements_card.jpg";
import React, {useEffect, useState} from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";
import AbonnementCard from "../MainAbonements/AbonementsCard/abonementCard";
import {setUser} from "../../../states/storeSlice/appStateSlice";
import {useDispatch, useSelector} from "react-redux";
import config from "../../../config";
import inMemoryJWT from "../../../services/inMemoryJWT";
import {Resource} from "../../../context/AuthContext";
import ShowErrorMessage from "../../../utils/showErrorMessage";
import ShowSuccessMessage from "../../../utils/showSuccessMessage";



export default function MainProfile() {

    const dispatch = useDispatch();

    //const [photo, setPhoto] = useState('');
    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showAbonnementsList, setShowAbonnementsList] = useState(true);
    const [orders, setOrders] = useState([]);

    let user = useSelector((state) => state.userSliceMode.user);

    // useEffect для установки данных пользователя
    useEffect(() => {

        if (user) {
            setLastName(user.LastName);
            setFirstName(user.FirstName);
            setEmail(user.Email);
            setPassword(user.Password);


            Resource.get('/ordersByUser')
                .then(response => {
                    console.log('get.ordersByUser response.data: '+JSON.stringify(response.data, null, 2))
                    setOrders(response.data)
                })
                .catch(error => {
                    console.error('Failed to fetch orders:', error);
                });
        }
    }, [user]); // Выполнится только при изменении `user`

    const handleLastNameChange = (event) => {
        setLastName(event.target.value);
    }

    const handleFirstNameChange = (event) => {
        setFirstName(event.target.value);
    }

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const datae = {
            lastName: lastName,
            firstName: firstName,
            password: password,
            email: email
        }

        try {
            const response = await Resource.put('/clients', datae);

            if (response.status === 200) {
                ShowSuccessMessage('Client updated successfully')
                dispatch(setUser(response.data));
                setLastName(response.data.LastName);
                setFirstName(response.data.FirstName);
                setEmail(response.data.Email);
                setPassword(response.data.Password);
            }
        } catch (error) {
            ShowErrorMessage(error);
            console.error('response.status: ' + JSON.stringify(error.response.data.message, null, 2))
        }
    }

    return (
        <div style={{
            width: '70%',
            height: '100vh',
            background: 'rgba(117,100,163,255)',
            display: "flex",
            justifyContent: "center",
            alignItems: "center"

        }}>
            <div style={{
                marginLeft: '5%',
                marginRight: '5%',

                height: '600px',

                display: 'flex',
                justifyContent: 'space-between'
            }}>
                <div style={{width: '40%', display: 'flex', flexDirection: 'column'}}>
                    <div style={{marginBottom: '20px'}}>
                        {/*{abonnement.Photo}*/}
                        <img style={{width: '100%', height: 'auto'}} src={sad_doing_abonnements_card}/>
                    </div>
                    <TextField style={{marginBottom: '20px'}}
                               fullWidth
                               label="First Name"
                               value={firstName}
                               onChange={handleFirstNameChange}
                    />
                    <TextField style={{marginBottom: '20px'}}
                               fullWidth
                               label="Last Name"
                               value={lastName}
                               onChange={handleLastNameChange}
                    />
                    <TextField style={{marginBottom: '20px'}}
                               fullWidth
                               label="Password"
                               value={password}
                               onChange={handlePasswordChange}
                    />
                    <TextField style={{marginBottom: '20px'}}
                               fullWidth
                               disabled={true}
                               label="Email"
                               value={email}
                               onChange={handleEmailChange}
                    />
                    <Button
                        style={{
                            color: 'white',
                            background: 'rgb(160, 147, 197)',
                            height: '50px'
                        }}

                        onClick={handleSubmit}
                    >
                        Submit
                    </Button>
                </div>

                <div style={{width: '40%'}}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginBottom: '20px',
                        fontSize: '24px'
                    }}>Purchased Abonnements
                    </div>
                    <div style={{height: '550px', overflowY: 'scroll'}}>
                        {orders ? <div>
                            {orders.map(order => (
                                <AbonnementCard abonnement={order.Abonement} status={order.Status}/>
                            ))}
                        </div> : <div>There are no orders</div>}
                    </div>
                </div>

            </div>
        </div>
    )
}