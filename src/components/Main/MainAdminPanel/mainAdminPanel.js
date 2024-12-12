import Avatar from "@mui/material/Avatar";
import danilaAvatar from "../../../images/danila_avatar.jpg";
import Carousel from "react-multi-carousel";
import mainCss from "../../MainNavHome/MainNavHome.module.css";
import React, {useEffect, useState} from "react";
import Button from "@mui/material/Button";

import {
    FormControl, InputAdornment,
    InputLabel,
    ListItemText,
    MenuItem,
    Modal,
    OutlinedInput,
    Select,
    TextareaAutosize
} from "@mui/material";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import AbonnementCard from "../MainAbonements/AbonementsCard/abonementCard";
import {Resource} from "../../../context/AuthContext";
import showErrorMessage from "../../../utils/showErrorMessage";
import sad_doing_abonnements_card from "../../../images/sad_doing_abonnements_card.jpg";
import TextField from "@mui/material/TextField";
import {Checkbox} from "@mui/joy";
import {setUser} from "../../../states/storeSlice/appStateSlice";
import AbonnementsModal from "../../AdminPanel/AbonnementsModal";
import CoachesModal from "../../AdminPanel/CoachesModal";

/*const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};*/

export default function MainAdminPanel() {

    const [openAbonnementsModal, setOpenAbonnementsModal] = useState(false);

    const handleOpenAbonnementsModal = async () => {
        setOpenAbonnementsModal(true);
    }
    const handleCloseAbonnementsModal = () => {
        setOpenAbonnementsModal(false);
    };

    //Coashes
    const [openCoachesModal, setOpenCoachesModal] = useState(false);

    const handleOpenCoachesModal = async () => {
        setOpenCoachesModal(true);
    }
    const handleCloseCoachesModal = () => {
        setOpenCoachesModal(false);
    }

    return (
        <div style={{width: '70%', height: '100vh', background: 'rgba(117,100,163,255)'}}>

            {/* Abonnements modal window */}
            <Modal
                open={openAbonnementsModal}
                onClose={handleCloseAbonnementsModal}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <AbonnementsModal onClose={handleCloseAbonnementsModal}/>
            </Modal>

            {/* Coaches modal window */}
            <Modal
                open={openCoachesModal}
                onClose={handleCloseCoachesModal}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
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

                    <CoachesModal onClose={handleCloseCoachesModal}/>

                </div>
            </Modal>

            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: "center",
                height: '100%',
                flexDirection: 'column'
            }}>
                <Button
                    style={{
                        marginTop: '20px',
                        color: 'white',
                        background: 'rgba(160, 147, 197, 1)',
                        width: '270px',
                        height: '50px',
                        marginBottom: '50px',
                    }}

                    onClick={handleOpenAbonnementsModal}
                >
                    Abonnements
                </Button>
                <Button
                    style={{
                        marginTop: '20px',
                        color: 'white',
                        background: 'rgba(160, 147, 197, 1)',
                        width: '270px',
                        height: '50px',
                        marginBottom: '50px',
                    }}

                    onClick={handleOpenCoachesModal}
                >
                    Coaches
                </Button>
            </div>

        </div>
    );

}