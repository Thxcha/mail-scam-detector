import * as React from "react";
import { useEffect, useState } from "react";
import { Card, CardContent, Grid, Box } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart";

const Dashboard = () => {
  const [scamCount, setScamCount] = useState(0);
  const [nonScamCount, setNonScamCount] = useState(0);
  const [scamCount0, setScamCount0] = useState(0);
  const [nonScamCount0, setNonScamCount0] = useState(0);
  const [scamCount1, setScamCount1] = useState(0);
  const [nonScamCount1, setNonScamCount1] = useState(0);
  const [scamCount2, setScamCount2] = useState(0);
  const [nonScamCount2, setNonScamCount2] = useState(0);
  const [scamCount3, setScamCount3] = useState(0);
  const [nonScamCount3, setNonScamCount3] = useState(0);
  const [scamCount4, setScamCount4] = useState(0);
  const [nonScamCount4, setNonScamCount4] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const scamRes = await fetch("/api/users/label/1");
        const nonScamRes = await fetch("/api/users/label/0");
        const scamRes0 = await fetch("/api/users/label_date/1/0");
        const nonScamRes0 = await fetch("/api/users/label_date/0/0");
        const scamRes1 = await fetch("/api/users/label_date/1/1");
        const nonScamRes1 = await fetch("/api/users/label_date/0/1");
        const scamRes2 = await fetch("/api/users/label_date/1/2");
        const nonScamRes2 = await fetch("/api/users/label_date/0/2");
        const scamRes3 = await fetch("/api/users/label_date/1/3");
        const nonScamRes3 = await fetch("/api/users/label_date/0/3");
        const scamRes4 = await fetch("/api/users/label_date/1/4");
        const nonScamRes4 = await fetch("/api/users/label_date/0/4");

        const scamData = await scamRes.json();
        const nonScamData = await nonScamRes.json();
        const scamData0 = await scamRes0.json();
        const nonScamData0 = await nonScamRes0.json();
        const scamData1 = await scamRes1.json();
        const nonScamData1 = await nonScamRes1.json();
        const scamData2 = await scamRes2.json();
        const nonScamData2 = await nonScamRes2.json();
        const scamData3 = await scamRes3.json();
        const nonScamData3 = await nonScamRes3.json();
        const scamData4 = await scamRes4.json();
        const nonScamData4 = await nonScamRes4.json();

        setScamCount(scamData);
        setNonScamCount(nonScamData);
        setScamCount0(scamData0);
        setNonScamCount0(nonScamData0);
        setScamCount1(scamData1);
        setNonScamCount1(nonScamData1);
        setScamCount2(scamData2);
        setNonScamCount2(nonScamData2);
        setScamCount3(scamData3);
        setNonScamCount3(nonScamData3);
        setScamCount4(scamData4);
        setNonScamCount4(nonScamData4);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="gray.100">
      <Grid container spacing={3} justifyContent="center" alignItems="center">
        <Grid item>
          <Card sx={{ p: 3, boxShadow: 3, textAlign: "center" }}>
            <h2
              style={{
                marginBottom: "16px",
                fontSize: "20px",
                fontWeight: "bold",
              }}>
              Scam Detection Overview
            </h2>
            <CardContent>
              <PieChart
                series={[
                  {
                    data: [
                      { id: 0, value: scamCount, label: "Scam" },
                      { id: 1, value: nonScamCount, label: "Non-Scam" },
                    ],
                  },
                ]}
                width={600}
                height={400}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item>
          <Card sx={{ p: 3, boxShadow: 3, textAlign: "center" }}>
            <h2
              style={{
                marginBottom: "16px",
                fontSize: "20px",
                fontWeight: "bold",
              }}>
              Scam Detection Bar Chart By Date
            </h2>
            <CardContent>
              <BarChart
                xAxis={[{scaleType: 'band', data: ['4 day ago', '3 day ago', '2 day ago','1 day ago','today'] ,categoryGapRatio: 0.3, barGapRatio: 0.1}]}
                series={[
                  { data: [scamCount4, scamCount3, scamCount2, scamCount1, scamCount0], stack: "A", label: "Scam" },
                  { data: [nonScamCount4, nonScamCount3, nonScamCount2, nonScamCount1, nonScamCount0], stack: "A", label: "Non-scam" },
                ]}
                barLabel={(item, context) => {
                  if ((item.value ?? 0) > 10) {
                    return "High";
                  }
                  return context.bar.height < 60
                    ? null
                    : item.value?.toString();
                }}
                width={600}
                height={400}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
