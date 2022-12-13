import { Numbers, NumbersOutlined } from "@mui/icons-material";
import {
  Button,
  Container,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import React, { FormEvent, useState } from "react";
import fetchGraphQL from "../graphql/GraphQL";
import { Location, Launch, Mission, Orbit, Payload } from "../graphql/schema";

const MISSION: Mission = {
  id: "",
  title: "",
  operator: "",
  launch: {
    date: new Date(),
    vehicle: "",
    location: {
      name: "",
      longitude: 0,
     Latitude: 0,
    },
  },
  orbit: {
    apoapsis: 0,
    periapsis: 0,
    inclination: 0,
  },
  payload: {
    capacity: 0,
    available: 0,
  },
};
const LAUNCH: Launch = {
  date: new Date(),
  vehicle: "",
  location: {
    name: "",
    longitude: 0,
    Latitude: 0,
  },
};
const LOCATION: Location = {
  name: "",
  longitude: 0,
  Latitude: 0,
};
interface MissionResponse {
  data: {
    Mission: Mission;
  };
}
type Props = {
  handleNewMissionClose: () => void;
  updated: boolean;
  setUpdated: (updated: boolean) => void;
};
const createMission = async (mission: Mission): Promise<MissionResponse> => {
  console.log(mission)
  const m = {
    title: mission.title,
    operator: mission.operator,
    launch: {
      date: mission.launch.date,
      vehicle: mission.launch.vehicle,
      location: {
        name: mission.launch.location.name,
        longitude: mission.launch.location.longitude,
        Latitude: mission.launch.location.Latitude,
      },
    },
    orbit: {
      periapsis: mission.orbit.periapsis,
      apoapsis: mission.orbit.apoapsis,
      inclination: mission.orbit.inclination,
    },
    payload: {
      capacity: mission.payload.capacity,
      available: mission.payload.available,
    },
  };
  return await fetchGraphQL(
    `
    mutation CreateMission($mission: MissionInput!){
      createMission(
        mission: $mission
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
    { mission: m }
  );
};  

function NewMissionForm({ handleNewMissionClose, setUpdated, updated }: Props) {
  const [tempLaunchDate, setTempLaunchDate] = useState<Date | null>(null);
  const [formData, updateFormData] = useState();
  const [data, setData] = useState<Mission>(MISSION);
  const [launch, setLaunchData] = useState(MISSION.launch);
  const [location, setLocationData] = useState(LOCATION);
  const [orbit, setOrbitData] = useState(MISSION.orbit);
  const [payload, setPayloadData] = useState(MISSION.payload);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log(data)
    createMission(data);
    setUpdated(!updated);
    handleNewMissionClose();
  };

  function updateData(Data: Partial<any>) {
    setData((prev) => {
      return { ...prev, ...Data };
    });
  }
  const handleTempLaunchDateChange = (newValue: Date | null) => {
    setTempLaunchDate(newValue);
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <DialogTitle>New Mission</DialogTitle>

        <DialogContent>
          <Container>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <TextField
                  value={data.title}
                  onChange={(e) => updateData({ title: e.target.value })}
                  autoFocus
                  id="title"
                  label="Title"
                  variant="standard"
                  fullWidth
                  required
                />
                <TextField
                  value={data.operator}
                  onChange={(e) => updateData({ operator: e.target.value })}
                  autoFocus
                  id="operator"
                  label="Operator"
                  variant="standard"
                  fullWidth
                  required
                />
                <TextField
                  onChange={(e) =>
                    updateData( {vehicle:e.target.value } )
                  }
                  autoFocus
                  id="vehicle"
                  name="vehicle"
                  label="Vehicle"
                  variant="standard"
                  fullWidth
                  required
                />
                <div>
                  <div className="inline-grid col-span-2">
                  <TextField
                    onChange={(e) =>
                      updateData({ Name: e.target.value })
                    }
                    autoFocus
                    id="location"
                    label="Location"
                    variant="standard"
                  />
                  <TextField
                    type="number"
                    //value={LOCATION.Latitude}
                    onChange={(e) =>
                      updateData({ Latitude: e.target.value })
                    }
                    autoFocus
                    id="Latitude"
                    name="Latitude"
                    label="Latitude"
                    variant="standard"
                    fullWidth
                    required
                  />
                  <TextField
                    autoFocus
                    id="longitude"
                    type="number"
                    name="longitude"
                    onChange={(e) =>
                      updateData({ longitude: e.target.value })
                    }
                    label="Longitude"
                    variant="standard"
                    fullWidth
                    required
                  />
                </div>
                   </div>
                <TextField
                  autoFocus
                  id="periapsis"
                  type="number"
                  name="periapsis"
                  onChange={(e) =>
                    updateData({ periapsis: e.target.value })
                  }
                  label="Periapsis"
                  variant="standard"
                  fullWidth
                  required
                />
                <TextField
                  autoFocus
                  id="apoapsis"
                  label="Apoapsis"
                  type="number"
                  name="apoapsis"
                  onChange={(e) =>
                    updateData({ apoapsis: e.target.value })
                  }
                  variant="standard"
                  fullWidth
                  required
                />
                <TextField
                  autoFocus
                  id="inclination"
                  type="number"
                  name="inclination"
                  onChange={(e) =>
                    updateData({ inclination: e.target.value })
                  }
                  label="Inclination"
                  variant="standard"
                  fullWidth
                  required
                />
                <TextField
                  autoFocus
                  type="number"
                  name="capacity"
                  onChange={(e) =>
                    updateData({ capacity: e.target.value })
                  }
                  id="capacity"
                  label="Capacity"
                  variant="standard"
                  fullWidth
                  required
                />
                <TextField
                  autoFocus
                  type="number"
                  name="available"
                  onChange={(e) =>
                    updateData({ available: e.target.value })
                  }
                  id="available"
                  label="Available slots"
                  variant="standard"
                  fullWidth
                  required
                />
              </Grid>

              <Grid item>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    minDate={new Date()}
                    minTime={new Date()}
                    label="Launch Date"
                    value={tempLaunchDate}
                    onChange={handleTempLaunchDateChange}
                    renderInput={(params) => (
                      <TextField
                        onChange={(e) =>
                          updateData({
                            date:
                              tempLaunchDate !== null
                                ? new Date(tempLaunchDate)
                                : new Date(),
                          })
                        }
                        required
                        variant="standard"
                        {...params}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
            <DialogActions>
              <Button onClick={handleNewMissionClose}>Cancel</Button>
              <Button type="submit">Save</Button>
            </DialogActions>
          </Container>
        </DialogContent>
      </form>
    </div>
  );
}

export default NewMissionForm;
