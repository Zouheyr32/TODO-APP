"use client";
import { styled, Container, Box } from "@mui/material";
import React from "react";
import Sidebar from "./layout/sidebar/Sidebar";
import Footer from "./layout/footer/page";

const MainWrapper = styled("div")(() => ({
  display: "flex",
  minHeight: "100vh",
  width: "100%",
}));

const PageWrapper = styled("div")(() => ({
  display: "flex",
  flexGrow: 1,
  flexDirection: "column",
  backgroundColor: "transparent",
  minHeight: "100vh",
}));

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <MainWrapper className="mainwrapper">
      {/* Sidebar */}
      <Sidebar />

      <PageWrapper className="page-wrapper">
        {/* Page Content */}
        <Container
          maxWidth="xl"
          sx={{
            paddingTop: "30px",
            paddingBottom: "30px",
            minHeight: "100vh",
            flexGrow: 1,
          }}
        >
          <Box>{children}</Box>
        </Container>

        {/* Footer */}
        <Footer />
      </PageWrapper>
    </MainWrapper>
  );
}
