# Project Name

This project is a Fastify API that allows a user to upload files to a Hyperdrive, and view the files that have been uploaded. The API also provides information about the Hyperdrive key.

## Installation

1. Clone the repository: `git clone https://github.com/maumercado/hyperdrive-poc.git`
2. Go to the server folder `cd ./hyperdrive-poc/server`
3. Install dependencies: `npm install`

## Usage

1. Start the server: `npm run start`
2. Upload files to the Hyperdrive by making a POST request to `/upload`
3. View uploaded files by making a GET request to `/files`
4. Get the Hyperdrive key by making a GET request to `/info`
5. Share the Hyperdrive key to allow others to mirror or download the files using the [`drives` cli](https://github.com/holepunchto/drives) created by holepunch.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
