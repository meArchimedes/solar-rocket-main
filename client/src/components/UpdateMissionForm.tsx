import {
  Button,
  Container,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import React, { FormEvent, useState } from "react";
import fetchGraphQL from "../graphql/GraphQL";
import { Mission, Location as loc } from "../graphql/schema";
interface MissionResponse {
  data: {
    Mission: Mission;
  };
}
type Props = {
  mission: Mission;
  updated: boolean;
  setSubmitting: (updated: boolean) => void;
  handleUpdateMissionClose: () => void;
};
type MissionInput= {
  id: String,
  Latitude: Number,
  longitude: Number,
  name: String,
  date: Date,
};
const UpdateMission = async (mission: Mission): Promise<MissionResponse> => {
    console.log(mission)
  return await fetchGraphQL(
    `
      mutation UpdateMission($mission: UpdateMissionInput!){
      updateMission(
        mission: $mission
        )
        {
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
        }`,
    { mission: mission }
  );
};

function UpdateMissionForm({
  mission, 
  updated,
  setSubmitting,
  handleUpdateMissionClose,
}: Props) {
  const [tempLaunchDate, setTempLaunchDate] = useState<Date | null>(null);
  const [LaunchData, setLaunchData] = useState(mission.launch.location);
  const handleTempLaunchDateChange = (newValue: Date | null) => {
    setTempLaunchDate(newValue);
  };
  function updateFields(data: Partial<loc>) {
    setLaunchData((prev) => {
      return { ...prev, ...data };
    });
  }
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    mission.launch.location=LaunchData;
    UpdateMission(mission)
      .then((result: MissionResponse) => {
        handleUpdateMissionClose();
        setSubmitting(!updated);
      })
      .catch((err: any) => {
        console.log(err);
      });
  }
  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle>Update Mission</DialogTitle>
      <DialogContent>
        <Container>
       
          <TextField
            onChange={(e) => updateFields({ name: e.target.value })}
            autoFocus
            defaultValue={mission.launch.location.name}
            id="name"
            name="name"
            label="Location"
            variant="standard"
            fullWidth
            required
          />
          <TextField
            type="number"
            //value={LOCATION.Latitude}
            onChange={(e) => updateFields({ Latitude: Number(e.target.value) })}
            autoFocus
            defaultValue={mission.launch.location.Latitude}
            id="Latitude"
            name="Latitude"
            label="Latitude"
            variant="standard"
            fullWidth
            required
          />
          <TextField
            autoFocus
            defaultValue={mission.launch.location.longitude}
            id="longitude"
            type="number"
            name="longitude"
            onChange={(e) =>
              updateFields({ longitude: Number(e.target.value) })
            }
            label="Longitude"
            variant="standard"
            fullWidth
            required
          />
        </Container>
      </DialogContent>
      <DialogActions>
        <Button type="button" onClick={handleUpdateMissionClose}>
          Cancel
        </Button>
        <Button type="submit">Update</Button>
      </DialogActions>
    </form>
  );
}
export default UpdateMissionForm;
