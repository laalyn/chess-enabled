const local_api = 'http://localhost:6369/api';
const local_socket = 'ws://localhost:6369/socket';

// root is hardcoded into nuxt config as well
export const server = {
  root: local_api,
  socket_root: local_socket,
};
