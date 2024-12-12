import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import AbonnementCard from "../Main/MainAbonements/AbonementsCard/abonementCard";
import sad_doing_abonnements_card from "../../images/sad_doing_abonnements_card.jpg";
import TextField from "@mui/material/TextField";
import {FormControl, InputAdornment, InputLabel, ListItemText, MenuItem, OutlinedInput, Select} from "@mui/material";
import {Checkbox} from "@mui/joy";
import Button from "@mui/material/Button";
import React, {useEffect, useState} from "react";
import {Resource} from "../../context/AuthContext";
import showErrorMessage from "../../utils/showErrorMessage";
import ShowSuccessMessage from "../../utils/showSuccessMessage";
import ShowErrorMessage from "../../utils/showErrorMessage";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

export default function AbonnementsModal({onClose}) {

    const [abonnements, setAbonnements] = useState([]);
    const [currentAbonnement, setCurrentAbonnement] = useState('');

    const [title, setTitle] = useState('');
    const [validityPeriod, setValidityPeriod] = useState('');
    const [visitingTime, setVisitingTime] = useState('');
    const [price, setPrice] = useState('');
    const [currentServices, setCurrentServices] = useState([]);
    const [allServices, setAllServices] = useState([]);

    useEffect(() => {
        Resource.get('/abonnements')
            .then(response => {
                setAbonnements(response.data);
            })
            .catch(error => {
                showErrorMessage(error);
                console.error('Failed to fetch abonnements:', error);
            });

        Resource.get('/services')
            .then(response => {
                setAllServices(response.data);
            })
            .catch(error => {
                showErrorMessage(error);
                console.error('Failed to fetch services:', error);
            });
    }, []);

    const handleCloseAbonnementsModal = () => {
        setTitle('');
        setValidityPeriod('');
        setVisitingTime('');
        setPrice('');
        setCurrentServices([]);
        setCurrentAbonnement('');

        onClose()
        //setOpenAbonnementsModal(false);
    };

    const handleAbonementSelection = async (selectedAbonnement) => {

        if (currentAbonnement.Id === selectedAbonnement.Id) {
            setCurrentAbonnement('');
        } else {
            setCurrentAbonnement(selectedAbonnement);
        }
    }

    const handleTitleChange = async (event) => {
        setTitle(event.target.value);
    }
    const handleValidityPeriodChange = async (event) => {
        setValidityPeriod(event.target.value);
    }
    const handleVisitingTimeChange = async (event) => {
        setVisitingTime(event.target.value);
    }
    const handlePriceChange = async (event) => {
        const input = event.target.value;

        // Очищаем все символы, кроме цифр
        const filteredInput = input.replace(/[^\d]/g, '');

        // Ограничиваем количество символов до определенной величины (например, 10)
        const maxLength = 10; // Максимальное количество символов
        const truncatedInput = filteredInput.slice(0, maxLength);

        // Обновляем состояние с отфильтрованным и обрезанным значением
        setPrice(truncatedInput);
    }
    const handleServicesChange = async (service) => {
        if (currentServices.map(serviceObg => serviceObg.Id).includes(service.Id)) {
            const updatedServices = currentServices.filter(serviceObj => serviceObj.Id !== service.Id);
            setCurrentServices(updatedServices);
        } else {
            setCurrentServices([service, ...currentServices]);
        }
    }

    //Current abonement changing
    useEffect(() => {

        if (currentAbonnement) {
            setTitle(currentAbonnement.Title);
            setValidityPeriod(currentAbonnement.Validity);
            setVisitingTime(currentAbonnement.VisitingTime);
            setPrice(currentAbonnement.Price);
            setCurrentServices(currentAbonnement.AbonementService.map(as => as.Service));
        } else {
            setTitle('');
            setValidityPeriod('');
            setVisitingTime('');
            setPrice('');
            setCurrentServices([]);
        }

    }, [currentAbonnement]);

    const handleDelete = async (event) => {
        event.preventDefault();

        const abonementId = currentAbonnement.Id;

        const url = `/abonnements/${abonementId}`;

        try {
            if (currentAbonnement) {
                const response = await Resource.delete(url);

                if (response.status === 200) {
                    setAbonnements(abonnements.filter(item => item.Id !== response.data.Id))

                    setTitle('');
                    setValidityPeriod('');
                    setVisitingTime('');
                    setPrice('');
                    setCurrentServices([]);
                    setCurrentAbonnement('');

                    ShowSuccessMessage("Abonement deleted successfully")
                }

            }
        } catch (error) {
            ShowErrorMessage(error)
            //console.error('error.response: ' + JSON.stringify(error.response, null, 2))
        }
    }
    const handleSubmit = async (event) => {
        event.preventDefault();

        const data = {
            abonementId: currentAbonnement.Id,
            title: title,
            validityPeriod: validityPeriod,
            visitingTime: visitingTime,
            price: price,
            services: currentServices.map(service=>service.Id)
        }

        try {

            if (currentAbonnement) {
                const response = await Resource.put('/abonnements', data);

                if (response.status === 200) {
                    setTitle(response.data.Title);
                    setValidityPeriod(response.data.Validity);
                    setVisitingTime(response.data.VisitingTime);
                    setPrice(response.data.Price);
                    setCurrentServices(response.data.AbonementService.map(as => as.Service));
                    setCurrentAbonnement(response.data);

                    const newArray = abonnements.map(abonement => {
                        if (abonement.Id === response.data.Id) {
                            return response.data;
                        }
                        return abonement;
                    });

                    setAbonnements(newArray);
                    ShowSuccessMessage("Abonement updated successfully")
                }
            } else {
                const response = await Resource.post('/abonnements', data);

                if (response.status === 200) {

                    setTitle(response.data.Title);
                    setValidityPeriod(response.data.Validity);
                    setVisitingTime(response.data.VisitingTime);
                    setPrice(response.data.Price);
                    setCurrentServices(response.data.AbonementService.map(as => as.Service));

                    setAbonnements([response.data, ...abonnements]);
                    setCurrentAbonnement(response.data);
                    ShowSuccessMessage("Abonement created successfully")
                }
            }

        } catch (error) {
            ShowErrorMessage(error)
            console.error('response.status: ' + JSON.stringify(error.response.data.message, null, 2))
        }
    }

    return (
        <div
            style={{
                color: "white",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                background: "rgba(117,100,163,255)",
                borderRadius: "8px",
                padding: "20px",
                width: '1000px',
                height: '600px'
            }}
        >
            <div>
                <IconButton onClick={handleCloseAbonnementsModal} size="large"
                            sx={{position: 'absolute', top: 10, right: 10}}>
                    <CloseIcon/>
                </IconButton>
            </div>

            <div style={{display: 'flex', marginTop: '10px', gap: '20px'}}>
                <div style={{width: '40%'}}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginBottom: '10px',
                        fontSize: '18px'
                    }}>
                        All Abonnements
                    </div>
                    <div style={{height: '550px', overflowY: 'scroll'}}>
                        {abonnements.length > 0 ? <div>
                            {abonnements.map(abonnement => (
                                <div key={abonnement.Id}>
                                    <div
                                        style={{border: currentAbonnement === abonnement ? '3px solid yellow' : 'none'}}>
                                        <AbonnementCard
                                            abonnement={abonnement}
                                            onClick={() => handleAbonementSelection(abonnement)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div> : <div>There are no orders</div>}
                    </div>
                </div>
                <div style={{width: '60%', height: '100%'}}>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginBottom: '10px',
                        fontSize: '18px'
                    }}>
                        {currentAbonnement ? 'Edit Abonnement' : 'Create Abonnement'}
                    </div>

                    <div style={{display: 'flex', alignItems: "center", gap: "10px"}}>
                        <div style={{marginBottom: '20px'}}>
                            {/*{abonnement.Photo}*/}
                            <img style={{width: '200px', height: 'auto'}} src={sad_doing_abonnements_card}/>
                        </div>

                        <TextField style={{marginBottom: '10px'}}
                                   fullWidth
                                   label="Title"
                                   value={title}
                                   onChange={handleTitleChange}
                        />
                    </div>


                    <FormControl fullWidth style={{marginBottom: '10px'}}>
                        <InputLabel>Validity Period</InputLabel>
                        <Select

                            value={validityPeriod}
                            label="Validity Period"
                            onChange={handleValidityPeriodChange}
                        >
                            <MenuItem value={'1'}>1</MenuItem>
                            <MenuItem value={'3'}>3</MenuItem>
                            <MenuItem value={'6'}>6</MenuItem>
                            <MenuItem value={'12'}>12</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth style={{marginBottom: '10px'}}>
                        <InputLabel>Visiting Time</InputLabel>
                        <Select
                            value={visitingTime}
                            label="Visiting Time"
                            onChange={handleVisitingTimeChange}
                        >
                            <MenuItem value={'7.00 - 14.00'}>7.00 - 14.00</MenuItem>
                            <MenuItem value={'14.00 - 24.00'}>14.00 - 24.00</MenuItem>
                            <MenuItem value={'Any Time'}>Any Time</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth style={{marginBottom: '10px'}}>
                        <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-amount"
                            startAdornment={<InputAdornment position="start">$</InputAdornment>}
                            label="Amount"
                            value={price}
                            onChange={handlePriceChange}
                        />
                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel fullWidth>Services</InputLabel>
                        <Select
                            fullWidth
                            multiple
                            value={currentServices}
                            input={<OutlinedInput label="Tag"/>}
                            renderValue={(selected) => selected.map(sel => sel.Title + ' ')}
                            MenuProps={MenuProps}
                        >
                            {allServices.map((service) => (
                                <MenuItem key={service.Id} value={service.Title}>
                                    <Checkbox onChange={() => handleServicesChange(service)}
                                              checked={currentServices.map(ser => ser.Id).includes(service.Id)}/>
                                    <ListItemText primary={service.Title}/>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {
                        currentAbonnement && (
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                marginTop: '25px'
                            }}>
                                <Button
                                    style={{
                                        color: 'white',
                                        background: 'rgb(160, 147, 197)',
                                        height: '50px',
                                        width: '80%'
                                    }}

                                    onClick={handleDelete}
                                >
                                    Delete
                                </Button>
                            </div>
                        )
                    }

                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: currentAbonnement ? '20px' : '100px'
                    }}>
                        <Button
                            style={{
                                color: 'white',
                                background: 'rgb(160, 147, 197)',
                                height: '50px',
                                width: '80%'
                            }}

                            onClick={handleSubmit}
                        >
                            Submit
                        </Button>
                    </div>

                </div>
            </div>


        </div>
    )
}