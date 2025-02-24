import React, { useContext } from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Link, useLocation } from "react-router-dom";
import Divider from "@mui/material/Divider";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { Outlet } from "react-router-dom";
import TabForm from "./forms/ResponsiveTabForm";
import AdminContext from "../context/admin";

export default function TabsToolbar({ routes, createButtonRoute }) {
  const { pathname } = useLocation();
  const { admin } = useContext(AdminContext);

  return (
    <>
      <Toolbar style={{ width: "93.7%" }}>
        <Typography
          variant="button"
          color="inherit"
          component="div"
          noWrap={true}
          sx={{
            flexGrow: 1,
            fontWeight: 400,
            color: "rgba(0, 0, 0, 0.6)",
            fontSize: 20,
            minWidth: 170,
            // sm: { display: "none", color: "red"}
            display: { xs: "none", sm: "block" },
          }}
        >
          PRIVATE CLOUD
        </Typography>
        <Divider
          orientation="vertical"
          variant="middle"
          flexItem
          sx={{ display: { xs: "none", sm: "block" } }}
        />
        <Box sx={{ width: "100%" }}>
          <Tabs value={routes.indexOf(pathname)} aria-label="nav tabs">
            <Tab
              component={Link}
              label={
                pathname.includes("admin") ? "Active Requests" : "Requests"
              }
              to={routes[0]}
            />
            <Tab component={Link} label="Products" to={routes[1]} />
          </Tabs>
        </Box>
        {pathname === routes[1] && admin ? <TabForm /> : null}
        <Button
          component={Link}
          to={createButtonRoute}
          variant="outlined"
          style={{ border: "none", marginTop: 8, marginLeft: 15 }}
          size="large"
          endIcon={<AddIcon />}
        >
          Create
        </Button>
      </Toolbar>
      <Outlet />
    </>
  );
}
