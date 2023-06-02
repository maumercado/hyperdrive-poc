# HyperDrive POC

This project is a Fastify API and React application that allows a user to upload files to a Hyperdrive, and view the files that have been uploaded. The application also provides information about the Hyperdrive key.

## Installation

1. Clone the repository: `git clone https://github.com/maumercado/hyperdrive-poc.git`
2. Install dependencies: `npm run install:all`

## Usage

You could do:
1. Start both applications concurrently: `npm run start:all`

Or
1. Start the server: `npm run start:server`
2. Start the application: `npm run start:app`

And then

3. Upload files to the Hyperdrive by visiting the Upload page
4. View uploaded files by visiting the Files page
5. Get the Hyperdrive key by visiting the Info page
6. Share the Hyperdrive key to allow others to mirror or download the files using the `drives` cli created by holepunch.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the [ISC License](https://opensource.org/licenses/ISC).
