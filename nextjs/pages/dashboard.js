import * as React from "react";
import { useEffect, useState } from "react";
import { Card, CardContent, Grid } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";

const Dashboard = () => {
  const [scamCount, setScamCount] = useState(0);
  const [nonScamCount, setNonScamCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const scamRes = await fetch("/api/users/label/1");
        const nonScamRes = await fetch("/api/users/label/0");
        
        const scamData = await scamRes.json();
        const nonScamData = await nonScamRes.json();
        
        setScamCount(scamData);
        setNonScamCount(nonScamData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <Grid item xs={0} sm={0}>
            <Card sx={{ p: 3, maxWidth: 800, width: "100%", boxShadow: 3 }}>
                <h2 style={{ textAlign: "center", marginBottom: "16px", fontSize: "20px", fontWeight: "bold" }}>
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
    </div>
  );
};

export default Dashboard;
