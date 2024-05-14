import React from 'react'
import { Container, Box, Text} from '@chakra-ui/react';
import SignUp from '../components/Authentication/SignUp';

const SignUpPage = () => {
  return (
    <Container maxW="xl" centerContent>
      <Box
        display="flex"
        justifyContent="center"
        padding="3"
        backgroundColor="white"
        width="100%"
        margin="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize='4xl' fontFamily="Work sans">
          Chat-Application
        </Text>
      </Box>
      <Box
        backgroundColor="white"
        w="100%"
        padding="4"
        borderRadius="lg"
        borderWidth="1px"
      >
        <SignUp />
      </Box>
    </Container>
  )
}

export default SignUpPage