import React, { useState } from 'react'
import { FormControl, FormLabel, VStack, Input, InputGroup, Button, InputRightElement, useToast } from '@chakra-ui/react';
import axios from 'axios';

const SignUp = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [confirmpassword, setConfirmPassword] = useState();
  const [password, setPassword] = useState();
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleClick = () => setShow(!show);

  const postDetails = (pic) => {
    setLoading(true);
    if (pic === undefined) {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom"
      })
      setLoading(false);
      return;
    }

    if (pic.type == "image/jpeg" || pic.type === "image/png") {
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "drg2sltqo");
      fetch("https://api.cloudinary.com/v1_1/drg2sltqo/image/upload", {
        method: 'post',
        body: data
      }).then((res) => res.json())
        .then(data => {
          setPic(data.url.toString());
          console.log(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom"
      });
      setLoading(false);
      return;
    }
  }

  const submitHandler = async() => {
    setLoading(true);
    if (!name  || !email || !password || !confirmpassword) {
      toast({
        title: "Please Fill all the Fields!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom"
      })
      setLoading(false);
      return;
    }
    if (password != confirmpassword) {
      toast({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom"
      })
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json"
        }
      };

      const { data } = await axios.post("/api/user",
        { name, email, password, pic },
        config
      );
    } catch (error) {

    }
  }

  return (
    <VStack spacing='5px' >
      <FormControl id='first-name' isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder='Enter Your Name'
          onChange={(e) => setName(e.target.value)}
          autoComplete="off"
        />
      </FormControl>

      <FormControl id='sign-up-email' isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder='Enter Your Email'
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="off"
        />
      </FormControl>

      <FormControl id='sign-up-password' isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show? "text" : "password"}
            placeholder='Enter Your Password'
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width='4.5rem'>
            <Button h='1.75rem' size='sm' onClick={handleClick}>
              {show ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id='confirm-password' isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={show? "text" : "password"}
            placeholder='Confirm password'
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <InputRightElement width='4.5rem'>
            <Button h='1.75rem' size='sm' onClick={handleClick}>
              {show ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>  
      
      <FormControl id="pic">
        <FormLabel>Upload your Picture</FormLabel>
        <Input
          type="file"
          padding={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>

      <Button
        colorScheme='blue'
        width='100%'
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Sign Up
      </Button>

    </VStack>
  );
}

export default SignUp