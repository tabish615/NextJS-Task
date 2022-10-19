import Head from 'next/head'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import { Select, Image, HStack, Text, VStack, Button, Flex } from '@chakra-ui/react'
import { AddIcon, MinusIcon } from '@chakra-ui/icons'

export default function Home() {
  const [data, setData] = useState([]);
  const [colours, setColours] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    fetch('https://my-json-server.typicode.com/benirvingplt/products/products')
    .then(response => response.json())
    .then(json => {json.forEach(obj => {obj.qty = 0, obj.total = 0}), setData(json)})
  }, [])

  useEffect(() => {
    if(data.length && !colours.length){
      let colours = []
      data.forEach(item => {
        if(!colours.includes(item.colour)){
          colours.push(item.colour)
        }})
      setColours(colours)
    }
  }, [data])

  const handleColourChange = (selectedColour) => {
    fetch('https://my-json-server.typicode.com/benirvingplt/products/products')
    .then(response => response.json())
    .then(json => {
      if(selectedColour.target.value) {
        let selectedItem = json.filter(item => item.colour == selectedColour.target.value);
        selectedItem.forEach(obj => {obj.qty = 0, obj.total = 0})
        setData(selectedItem)
      }
      else {
        let allItems = json
        allItems.forEach(obj => {obj.qty = 0, obj.total = 0})
        setData(allItems)
      }
    })
    setTotalPrice(0)
  }

  const setQty = (action, item) => {
    const arr = data.map(obj => {
      if(obj.id == item.id){
        if(action == 'inc'){
          return {...obj, qty : obj.qty+1, total : obj.price*(obj.qty+1)}
        }
        else if(action == 'dec') {
          return {...obj, qty : obj.qty-1, total : obj.price*(obj.qty-1)}
        }
        else {
          return {...obj, qty : 0, total : obj.price*0}
        }
      }
      return obj
    })
    setData(arr)

    let price = arr.map(item => item.total).reduce((prev, next) => prev + next);
    setTotalPrice(price)
  }
  return (
      <Flex alignItems="center" width="60vw" margin='auto' flexDirection='column'>
        <Select 
          placeholder='Select colour'
          onChange={handleColourChange}
          w={'30%'}
          m={'5%'}
        >
          {colours.length && colours.map((item, index) => {
            return (
              <option key={index} value={item}>{item}</option>
            )
          })}
        </Select>
        {data.length && data.map((item) => {
          return (
            <HStack key={item.id} m={5} w={'100%'} justifyContent='space-between'>
              <HStack>
                <Image 
                  src={item.img}
                  w={{ base: '100px' }}
                  h={{ base: '100px' }}
                />
                <VStack>
                  <Text fontSize='2xl'>{item.name}</Text>
                  <Text style={{width:'100%', textAlign: 'right'}} fontSize='xl' as='b'>Price : &euro;{item.price}</Text>
                </VStack>
              </HStack>
              <HStack>
                <Button onClick={() => setQty('dec', item)}>
                  <MinusIcon />
                </Button>
                    <Text fontSize='xl'>{item.qty}</Text>
                <Button onClick={() => setQty('inc', item)}>
                  <AddIcon />
                </Button>
                <Button onClick={() => setQty('rem', item)}>Remove</Button>
              </HStack>
            </HStack>
          )
        })}
        <Text style={{width:'100%', textAlign: 'right'}} as='b' fontSize='2xl'>Total Price : {totalPrice}</Text>
      </Flex>
  )
}
