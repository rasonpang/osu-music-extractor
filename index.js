import fs from 'fs';

const osuFolder = `D:\\Games\\osu!`;
const mp3ExtractFolder = `D:\\Song\\osu!`;

const movingFiles = async () => {
	const nonExtractedMusic = [];
	const osuMusicFolder = `${osuFolder}\\Songs`;
	const musicList = fs.readdirSync(osuMusicFolder);
	
	await Promise.all(musicList.map((musicName) => {
		const musicFolderPath = `${osuMusicFolder}\\${musicName}`;
		const musicFolder = fs.readdirSync(musicFolderPath);

		const musicFile = musicFolder.filter(i => String(i).includes('.mp3'));

		if (musicFile.length == 1) {
			const sourcePath = `${musicFolderPath}\\${musicFile[0]}`;
			const destPath = `${mp3ExtractFolder}\\${musicName}.mp3`;
			fs.copyFileSync(sourcePath, destPath);
		} else {
			nonExtractedMusic.push(musicName);
		}
	}));
	
	fs.writeFileSync('./non_extracted.json', JSON.stringify(nonExtractedMusic));
}

const renameFiles = async () => {
	const mp3Folder = fs.readdirSync(mp3ExtractFolder);

	await Promise.all(mp3Folder.map(fileName => {
		const [metadata, songName] = fileName.split(' - ');
		const [osuId, ...author] = metadata.split(' ');

		const fromName = `${mp3ExtractFolder}\\${fileName}`;
		const toName = `${mp3ExtractFolder}\\${author} - ${songName}`;

		fs.renameSync(fromName, toName);
	}))
};

// Hide function if in testing mode
const main = async () => {
	await movingFiles();
	await renameFiles();
}

main();