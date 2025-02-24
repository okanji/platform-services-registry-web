import React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import {
  defaultCpuOptionsLookup,
  defaultMemoryOptionsLookup,
  defaultStorageOptionsLookup,
} from "../common/Constants";
import TitleTypography from "../common/TitleTypography";
import Typography from "@mui/material/Typography";
import Styled from "styled-components";

String.prototype.capitalizeFirstLetter = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

export default function QuotaInput({
  nameSpace,
  formik,
  isDisabled,
  currentQuota = {},
}) {
  const cpu = formik.values[nameSpace + "Quota"]?.cpu;
  const memory = formik.values[nameSpace + "Quota"]?.memory;
  const storage = formik.values[nameSpace + "Quota"]?.storage;

  return (
    <Box sx={{ width: 340, mt: 3, mb: 5, mr: 4 }}>
      <TitleTypography>{nameSpace.capitalizeFirstLetter()}</TitleTypography>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <FormControl size="small" sx={{
          "& .MuiInputBase-input.Mui-disabled, .MuiInputBase-input-MuiOutlinedInput-input": {
            WebkitTextFillColor: "rgba(0, 0, 0, 0.87)",
          },
          "& .MuiInputLabel-root": {
            WebkitTextFillColor: "rgba(0, 0, 0, 0.87)",
          },
          "& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline, .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(0, 0, 0, 0.87)",
          },
          mt: 2, mb: 2, mr: 3
        }}>
          <InputLabel id="cpu-lebel">Cpu</InputLabel>

          <Select
            id={nameSpace + "Quota.cpu"}
            name={nameSpace + "Quota.cpu"}
            label="Cpu"
            disabled={isDisabled}
            value={cpu}
            onChange={formik.handleChange}
            error={
              formik.touched[nameSpace + "Quota"]?.cpu &&
              Boolean(formik.errors[nameSpace + "Quota"]?.cpu)
            }
            helpertext={
              formik.touched[nameSpace + "Quota"]?.cpu &&
              formik.errors[nameSpace + "Quota"]?.cpu
            }
          >
            {Object.entries(defaultCpuOptionsLookup).map((cpuOption) => (
              <MenuItem key={cpuOption[1]} value={cpuOption[0]}>
                {cpuOption[1]}
              </MenuItem>
            ))}
          </Select>
          {currentQuota.cpu &&
            cpu !== currentQuota.cpu && [
              <Typography variant="body1">Requested:</Typography>,
              <Typography variant="body1">
                {defaultCpuOptionsLookup[cpu]}
              </Typography>,
              <Typography variant="body1">Current:</Typography>,
              <Typography variant="body1">
                {defaultCpuOptionsLookup[currentQuota.cpu]}
              </Typography>,
            ]}
        </FormControl>
        <FormControl size="small" sx={{
          "& .MuiInputBase-input.Mui-disabled, .MuiInputBase-input-MuiOutlinedInput-input": {
            WebkitTextFillColor: "rgba(0, 0, 0, 0.87)",
          },
          "& .MuiInputLabel-root": {
            WebkitTextFillColor: "rgba(0, 0, 0, 0.87)",
          },
          "& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline, .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(0, 0, 0, 0.87)",
          },
          mt: 2, mb: 2, mr: 3, minWidth: 250
        }}>
          <InputLabel id="memory-label">Memory</InputLabel>
          <Select
            id={nameSpace + "Quota.memory"}
            name={nameSpace + "Quota.memory"}
            label="Memory"
            disabled={isDisabled}
            value={memory}
            onChange={formik.handleChange}
            error={
              formik.touched[nameSpace + "Quota"]?.memory &&
              Boolean(formik.errors[nameSpace + "Quota"]?.memory)
            }
            helpertext={
              formik.touched[nameSpace + "Quota"]?.memory &&
              formik.errors[nameSpace + "Quota"]?.memory
            }
          >
            {Object.entries(defaultMemoryOptionsLookup).map((memoryOption) => (
              <MenuItem key={memoryOption[1]} value={memoryOption[0]}>
                {memoryOption[1]}
              </MenuItem>
            ))}
          </Select>
          {currentQuota.memory &&
            memory !== currentQuota.memory && [
              <Typography variant="body1">Requested:</Typography>,
              <Typography variant="body1">
                {defaultMemoryOptionsLookup[memory]}
              </Typography>,
              <Typography variant="body1">Current:</Typography>,
              <Typography variant="body1">
                {defaultMemoryOptionsLookup[currentQuota.memory]}
              </Typography>,
            ]}
        </FormControl>
        <FormControl size="small" sx={{
          "& .MuiInputBase-input.Mui-disabled, .MuiInputBase-input-MuiOutlinedInput-input": {
            WebkitTextFillColor: "rgba(0, 0, 0, 0.87)",
          },
          "& .MuiInputLabel-root": {
            WebkitTextFillColor: "rgba(0, 0, 0, 0.87)",
          },
          "& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline, .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(0, 0, 0, 0.87)",
          },
          mt: 2, mb: 2, mr: 3, minWidth: 250
        }}>
          <InputLabel id="storage-label">Storage</InputLabel>
          <Select
            id={nameSpace + "Quota.storage"}
            name={nameSpace + "Quota.storage"}
            label="Storage"
            disabled={isDisabled}
            value={storage}
            onChange={formik.handleChange}
            error={
              formik.touched[nameSpace + "Quota"]?.storage &&
              Boolean(formik.errors[nameSpace + "Quota"]?.storage)
            }
            helpertext={
              formik.touched[nameSpace + "Quota"]?.storage &&
              formik.errors[nameSpace + "Quota"]?.storage
            }
          >
            {Object.entries(defaultStorageOptionsLookup).map(
              (storageOption) => (
                <MenuItem key={storageOption[1]} value={storageOption[0]}>
                  {storageOption[1]}
                </MenuItem>
              )
            )}
          </Select>
          {currentQuota.storage &&
            storage !== currentQuota.storage && [
              <Typography variant="body1">
                Requested: {defaultStorageOptionsLookup[storage]}
              </Typography>,
              <Typography variant="body1">
                Current: {defaultStorageOptionsLookup[currentQuota.storage]}
              </Typography>,
            ]}
        </FormControl>
      </Box>
    </Box>
  );
}
