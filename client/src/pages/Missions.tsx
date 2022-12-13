import { FormEvent, SyntheticEvent, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { AppLayout } from "../layouts/AppLayout";
import fetchGraphQL from "../graphql/GraphQL";
import { Mission } from "../graphql/schema";
import { graphql } from "graphql";
import NewMissionForm from "../components/NewMissionForm";
import UpdateMissionForm from "../components/UpdateMissionForm";
import {
  Card,
  CardHeader,
  CardActions,
  CardContent,
  Button,
  Grid,
  Typography,
  Fab,
  Dialog,
  Toolbar,
  Container,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  Box,
  CircularProgress,
} from "@mui/material";

import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterAlt as FilterAltIcon,
  Sort as SortIcon,
  ArrowDownward as ArrowDownwardIcon,
  ArrowUpward as ArrowUpwardIcon,
} from "@mui/icons-material";
import { ListMenu } from "../components/ListMenu";

type SortField = "Title" | "Date";
type MissionData = {
  id: string;
  title: string;
  operator: string;
  date: Date;
  vehicle: string;
  name: string;
  longitude: Number;
  Latitude: Number;
  periapsis: Number;
  apoapsis: Number;
  inclination: Number;
  capacity: Number;
  available: Number;
};

const INITIAL_DATA: MissionData = {
  id: "",
  title: " ",
  operator: " ",
  date: new Date(500000000000),
  vehicle: " ",
  name: " ",
  longitude: 0,
  Latitude: 0,
  periapsis: 0,
  apoapsis: 0,
  inclination: 0,
  capacity: 0,
  available: 0,
};
const MISSION: Mission = {
  id: "",
  title: "",
  operator: "",
  launch: {
    date: new Date(500000000000),
    vehicle: "",
    location: {
      name: " ",
      longitude: 0,
      Latitude: 0,
    },
  },
  orbit: { periapsis: 0, apoapsis: 0, inclination: 0 },
  payload: { capacity: 0, available: 0 },
};
interface MissionsResponse {
  data: {
    Missions: Mission[];
  };
}


const deleteMission = async (id: String): Promise<MissionsResponse> => {
  return await fetchGraphQL(
    ` mutation DeleteMission($id: DeleteInput!) {
      deleteMission(
        id: $id
      )
      {
      id
      title
      operator
      launch 
      {
        date
      }
    
  }
    }`,
    { id: { id } }
  );
};

const getMissions = async (
  sortField: SortField,
  sortDesc?: Boolean
): Promise<MissionsResponse> => {
  return await fetchGraphQL(
    `
  {
    Missions(
      sort: {
        field: ${sortField}
        desc: ${sortDesc}
      }
    ) {
      id
      title
      operator
      launch {
        date
        vehicle
        location {
          name
          longitude
          Latitude
        }
      }
      orbit {
        periapsis
        apoapsis
        inclination
      }
      payload {
        capacity
        available
      }
    }
  }
  `,
    []
  );
};

const Missions = (): JSX.Element => {
  const [missions, setMissions] = useState<Mission[] | null>(null);
  const [tempLaunchDate, setTempLaunchDate] = useState<Date | null>(null);
  const [newMissionOpen, setNewMissionOpen] = useState(false);
  const [updateMissionOpen, setUpdateMissionOpen] = useState(false);
  const [deleteMissionOpen, setDeleteMissionOpen] = useState(false);
  const [sortDesc, setSortDesc] = useState<boolean>(false);
  const [sortField, setSortField] = useState<SortField>("Title");
  const [data, setData] = useState(INITIAL_DATA);
  const [updateData, setUpdateData] = useState<Mission>(MISSION);
  const [errMessage, setErrMessage] = useState<String | null>(null);
  const [submitted, setSubmitting] = useState(false);
  const [missionState, setMission] = useState(MISSION);
  const handleErrClose = (event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") return;
    setErrMessage(null);
  };
function updateFields(fields: Partial<Mission>) {
    setUpdateData((prev) => {
      return { ...prev, ...fields };
    });
  }
  const handleNewMissionOpen = () => {
    setTempLaunchDate(null);
    setNewMissionOpen(true);
  };

  const handleUpdateMissionOpen = (key:any) => {
   if(missions !== null) setUpdateData(missions[key]);
    setUpdateMissionOpen(true);
  }
 const handleNewMissionClose = () => {
      setData(INITIAL_DATA);
      setNewMissionOpen(false);
  };
  const handleUpdateMissionClose = () => {
    updateFields(MISSION);
    setUpdateMissionOpen(false);
  };
  const handleDeleteMissionClose = () => {
    setDeleteMissionOpen(false);
  };
  const handleSortFieldChange = (event: SyntheticEvent, value: SortField) => {
    setSortField(value);
  };
  const handleSortDescClick = () => {
    setSortDesc(!sortDesc);
  };
  const handleDeleteMission = (key: any) =>{
    if (missions !== null) {
      let id: String = missions[key].id;
      deleteMission(id)
        .then((result: MissionsResponse) => {
          setSubmitting(!submitted);
        })
        .catch((err:any) => {
          setErrMessage("Failed to load missions.");
          console.log(err);

        });
    }
  }
  
  useEffect(() => {
    getMissions(sortField, sortDesc)
      .then((result: MissionsResponse) => {
        setMissions(result.data.Missions);
      })
      .catch((err) => {
        setErrMessage("Failed to load missions.");
        console.log(err);
      });
  }, [sortField, sortDesc, submitted]);

  return (
    <AppLayout title="Missions">
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1">
          Solar Rocket Missions
        </Typography>

        <Toolbar disableGutters>
          <Grid justifyContent="flex-end" container>
            <IconButton>
              <FilterAltIcon />
            </IconButton>
            <ListMenu
              options={["Date", "Title", "Operator"]}
              endIcon={<SortIcon />}
              onSelectionChange={handleSortFieldChange}
            />
            <IconButton onClick={handleSortDescClick}>
              {sortDesc ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
            </IconButton>
          </Grid>
        </Toolbar>

        {missions ? (
          <Grid container spacing={2}>
            {missions.map((mission: Mission, key: any) => (
              <Grid item key={key}>
                <Card sx={{ width: 275, height: 200 }}>
                  <CardHeader
                    title={mission.title}
                    subheader={new Date(mission.launch.date).toDateString()}
                  />
                  <CardContent>
                  <Typography noWrap>{mission.operator}</Typography>
                  <Typography noWrap>{mission.launch.vehicle}</Typography>                    
                  {/* <Typography noWrap>{mission.launch.location.Latitude}</Typography>                     */}
                 
                  <CardActions>
                  <Button
                      className="self-start"
                      onClick={() => handleUpdateMissionOpen(key)}
                    >
                      <EditIcon className="text-black hover:scale-125 cursor-pointer "></EditIcon>
                    </Button>
                    <Button
                      className="self-end fill-black"
                      onClick={() => handleDeleteMission(key)}
                    >
                      <DeleteIcon className="hover:scale-125 cursor-pointer text-black"></DeleteIcon>
                    </Button>                  
                  </CardActions> </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: "center" }}>
            <CircularProgress />
          </Box>
        )}

        <Tooltip title="New Mission">
          <Fab
            sx={{ position: "fixed", bottom: 16, right: 16 }}
            color="primary"
            aria-label="add"
            onClick={handleNewMissionOpen}
          >
            <AddIcon />
          </Fab>
        </Tooltip>
        <Dialog
          open={updateMissionOpen}
          onClose={handleUpdateMissionClose}
          fullWidth
          maxWidth="sm"
        >
          
          <UpdateMissionForm 
          handleUpdateMissionClose={ handleUpdateMissionClose}
          mission = {updateData}
          updated={submitted}
          setSubmitting={setSubmitting}/>
        </Dialog>
        <Dialog
          open={newMissionOpen}
          onClose={handleNewMissionClose}
          fullWidth
          maxWidth="sm"
        >
          <NewMissionForm
            handleNewMissionClose={handleNewMissionClose}
            updated={submitted}
            setUpdated={setSubmitting}
          />
        </Dialog>
        <Dialog
          open={deleteMissionOpen}
          onClose={handleDeleteMissionClose}
          maxWidth="sm"
        >
          <Dialog
          open={deleteMissionOpen}
          onClose={handleDeleteMissionClose}
          fullWidth
          maxWidth="sm">
              <Card >
                  <CardHeader
                    title={"Delete Mission"}
                  />
                  <CardContent>
                  <Typography noWrap>Are you sure about that?</Typography>
                  </CardContent>
                  <CardActions>
                    {/* <Button onClick={()=>handleDeleteMission(key)}>Yes, Delete</Button> */}
                    <Button onClick={handleDeleteMissionClose}>No, Cancel</Button>
                  </CardActions>
                </Card>
          </Dialog>
        </Dialog>
      </Container>
      <Snackbar
        open={errMessage != null}
        autoHideDuration={5000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        onClose={handleErrClose}
      >
        <Alert onClose={handleErrClose} variant="filled" severity="error">
          {errMessage}
        </Alert>
      </Snackbar>
    </AppLayout>
  );
};

export { Missions };
