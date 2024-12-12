import React, {useEffect, useState} from "react";
import {Resource} from "../../context/AuthContext";
import showErrorMessage from "../../utils/showErrorMessage";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import AbonnementCard from "../Main/MainAbonements/AbonementsCard/abonementCard";
import sad_doing_abonnements_card from "../../images/sad_doing_abonnements_card.jpg";
import TextField from "@mui/material/TextField";
import {
    FormControl,
    InputAdornment,
    InputLabel,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Select,
    TextareaAutosize
} from "@mui/material";
import {Checkbox} from "@mui/joy";
import Button from "@mui/material/Button";
import CoachCard from "../Main/MainCoaches/CoachesCard/coachCard";
import ShowErrorMessage from "../../utils/showErrorMessage";
import ShowSuccessMessage from "../../utils/showSuccessMessage";

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

export default function CoachesModal({onClose}) {
    const [coaches, setCoaches] = useState([]);
    const [currentCoach, setCurrentCoach] = useState('');

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const [currentServices, setCurrentServices] = useState([]);
    const [allServices, setAllServices] = useState([]);

    const handleServicesChange = async (service) => {
        if (currentServices.map(serviceObg => serviceObg.Id).includes(service.Id)) {
            const updatedServices = currentServices.filter(serviceObj => serviceObj.Id !== service.Id);
            setCurrentServices(updatedServices);
        } else {
            setCurrentServices([service, ...currentServices]);
        }
    }

    useEffect(() => {
        Resource.get('/coaches')
            .then(response => {
                setCoaches(response.data);
            })
            .catch(error => {
                showErrorMessage(error);
                console.error('Failed to fetch coaches:', error);
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

    const handleCloseCoachesModal = () => {
        setName('');
        setDescription('');
        setCurrentServices([]);

        onClose()
    };

    const handleCoachSelection = async (selectedCoach) => {

        if (currentCoach.Id === selectedCoach.Id) {
            setCurrentCoach('');
        } else {
            setCurrentCoach(selectedCoach);
        }
    }

    const handleNameChange = async (event) => {
        setName(event.target.value);
    }
    const handleDescriptionChange = async (e) => {

        const inputValue = e.target.value;

        if (inputValue.length > 500) {
            const truncatedText = inputValue.slice(0, 500);
            setDescription(truncatedText);
        } else {
            setDescription(inputValue);
        }
    }

    //Current coach changing
    useEffect(() => {

        if (currentCoach) {
            setName(currentCoach.Name);
            setDescription(currentCoach.Description);
            setCurrentServices(currentCoach.CoachService.map(as => as.Service));
        } else {
            setName('');
            setDescription('');
            setCurrentServices([]);
        }

    }, [currentCoach]);

    const handleDelete = async (event) => {
        event.preventDefault();

        const coachId = currentCoach.Id;

        const url = `/coaches/${coachId}`;

        try {
            if (currentCoach) {
                const response = await Resource.delete(url);

                if (response.status === 200) {
                    setCoaches(coaches.filter(item => item.Id !== response.data.Id))

                    setName('');
                    setDescription('');
                    setCurrentServices([]);
                    setCurrentCoach('');

                    ShowSuccessMessage("Coach deleted successfully")
                }

            }
        } catch (error) {
            ShowErrorMessage(error)
            console.error('response.status: ' + JSON.stringify(error.response.data.message, null, 2))
        }
    }
    const handleSubmit = async (event) => {
        event.preventDefault();

        const data = {
            id: currentCoach.Id,
            name: name,
            description: description,
            services: currentServices.map(service=>service.Id)
        }

        try {

            if (currentCoach) {
                const response = await Resource.put('/coaches', data);

                if (response.status === 200) {
                    setName(response.data.Name);
                    setDescription(response.data.Description);
                    setCurrentServices(response.data.CoachService.map(as => as.Service));
                    setCurrentCoach(response.data);

                    const newArray = coaches.map(coach => {
                        if (coach.Id === response.data.Id) {
                            return response.data;
                        }
                        return coach;
                    });

                    setCoaches(newArray);
                    ShowSuccessMessage("Coach updated successfully")
                }
            } else {
                const response = await Resource.post('/coaches', data);

                if (response.status === 200) {

                    setName(response.data.Name);
                    setDescription(response.data.Description);
                    setCoaches([response.data, ...coaches]);
                    setCurrentServices(response.data.CoachService.map(as => as.Service));
                    setCurrentCoach(response.data);

                    ShowSuccessMessage("Coach created successfully")
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
                <IconButton onClick={handleCloseCoachesModal} size="large"
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
                        All Coaches
                    </div>
                    <div style={{height: '550px', overflowY: 'scroll'}}>
                        {coaches.length > 0 ? <div>
                            {coaches.map(coach => (
                                <div key={coach.Id}>
                                    <div
                                        style={{border: currentCoach === coach ? '3px solid yellow' : 'none'}}>
                                        {/*<AbonnementCard
                                            abonnement={abonnement}
                                            onClick={() => handleAbonementSelection(abonnement)}
                                        />*/}

                                        <CoachCard key={coach.Id} coach={coach} width={'370px'} height={'310px'} imageSize={'100px'} button={false} onClick={() => handleCoachSelection(coach)}/>
                                    </div>
                                </div>
                            ))}
                        </div> : <div>There are no coaches</div>}
                    </div>
                </div>
                <div style={{width: '60%', height: '100%'}}>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginBottom: '10px',
                        fontSize: '18px'
                    }}>
                        {currentCoach ? 'Edit Coach' : 'Create Coach'}
                    </div>

                    <div style={{display: 'flex', alignItems: "center", gap: "10px"}}>
                        <div style={{marginBottom: '20px'}}>
                            {/*{abonnement.Photo}*/}
                            <img style={{width: '200px', height: 'auto'}} src={sad_doing_abonnements_card}/>
                        </div>

                        <TextField style={{marginBottom: '10px'}}
                                   fullWidth
                                   label="Name"
                                   value={name}
                                   onChange={handleNameChange}
                        />
                    </div>

                    <TextareaAutosize
                        style={{
                            width: "100%",
                            minHeight: "100px", // Минимальная высота для текстового поля
                            resize: "none", // Отключаем изменение размера по умолчанию
                            backgroundColor: "transparent", // Прозрачный фон
                            borderRadius: "4px",
                            padding: "8px",
                            boxSizing: "border-box",
                            marginBottom: '10px'

                        }}
                        value={description}
                        onChange={handleDescriptionChange}
                        maxRows={10} // Максимальное количество строк для отображения
                    />

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
                        currentCoach && (
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
                        marginTop: currentCoach ? '20px' : '100px'
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