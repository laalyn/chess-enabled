const local_api = 'http://localhost:6369/api';
const local_socket = 'ws://localhost:6369/socket';
const ec2_api = 'http://ec2-54-190-44-86.us-west-2.compute.amazonaws.com:6370/api'
const ec2_socket = 'ws://ec2-54-190-44-86.us-west-2.compute.amazonaws.com:6370/socket'
const cf_api = 'https://d3ryjut3q7flbd.cloudfront.net/api'
const cf_socket = 'wss://d3ryjut3q7flbd.cloudfront.net/socket'

// root is hardcoded into nuxt config as well
export const server = {
  root: cf_api,
  socket_root: cf_socket,
};

