import { Alert } from "react-native";
import * as FileSystem from 'expo-file-system';
import { Feather } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';

export const formatDateTime = (dateTimeString) => {
  const date = new Date(dateTimeString);
  const timeOptions = { hour: 'numeric', minute: 'numeric' };
  const dateFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };

  // Format time
  const formattedTime = date.toLocaleTimeString('en-US', timeOptions);

  // Format date
  const formattedDate = date.toLocaleDateString('en-US', dateFormatOptions);
  // console.log(formattedDate,formattedTime)

  return { formattedTime, formattedDate };
};



export const handleDownloadPress = async (imageUri, index, downloadProgress, setDownloadProgress) => {
  const mediaLibraryPermission = await MediaLibrary.getPermissionsAsync();
  console.log("mediaLibraryPermission", mediaLibraryPermission)
  if (mediaLibraryPermission.status !== 'granted') {
      alert('Permission required', 'We need permission to save images to your gallery.');
      return;
    }

    const fileUri = FileSystem.documentDirectory + imageUri.split('/').pop();

    const downloadResumable = FileSystem.createDownloadResumable(
      imageUri,
      fileUri,
      {},
      (downloadProgress) => {
        const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
        setDownloadProgress((prevState) => ({
          ...prevState,
          [index]: progress,
        }));
      }
    );

    try {
      const { uri } = await downloadResumable.downloadAsync();
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync('Download', asset, true);
      setDownloadProgress((prevState) => ({
        ...prevState,
        [index]: undefined, // Clear progress after download completion
      }));
      alert('Download complete');
    } catch (e) {
      console.error(e);
      setDownloadProgress((prevState) => ({
        ...prevState,
        [index]: undefined, // Clear progress on error
      }));
      alert('Download failed');
    }
}

export const handleDownload = async (imageUri, downloadProgress, setDownloadProgress) => {
  const index=1;
  const mediaLibraryPermission = await MediaLibrary.getPermissionsAsync();
  console.log("mediaLibraryPermission", mediaLibraryPermission)
  if (mediaLibraryPermission.status !== 'granted') {
      alert('Permission required', 'We need permission to save images to your gallery.');
      return;
    }

    const fileUri = FileSystem.documentDirectory + imageUri.split('/').pop();

    const downloadResumable = FileSystem.createDownloadResumable(
      imageUri,
      fileUri,
      {},
      (downloadProgress) => {
        const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
        setDownloadProgress((prevState) => ({
          ...prevState,
          [index]: progress,
        }));
      }
    );

    try {
      const { uri } = await downloadResumable.downloadAsync();
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync('Download', asset, true);
      setDownloadProgress((prevState) => ({
        ...prevState,
        [index]:1, // Clear progress after download completion
      }));
      // alert('Download complete');
    } catch (e) {
      console.error(e);
      setDownloadProgress((prevState) => ({
        ...prevState,
        [index]: undefined, // Clear progress on error
      }));
      // alert('Download failed');
    }
}

export function daysDifference(givenDate) {
  // Parse the given date
  const givenDateObj = new Date(givenDate);

  // Get today's date
  const today = new Date();

  // Calculate the time difference in milliseconds
  const timeDifference = today - givenDateObj;

  // Convert the time difference from milliseconds to days
  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  return daysDifference;
}

export function getFormattedDate() {
  const today = new Date();
  
  // Get the day of the month
  const day = today.getDate();
  
  // Array of month names
  const monthNames = [
      "January", "February", "March", "April", "May", "June", 
      "July", "August", "September", "October", "November", "December"
  ];
  
  // Get the month name
  const monthName = monthNames[today.getMonth()];
  
  // Get the year
  const year = today.getFullYear();
  
  // Format the date as "day, month name, year"
  const formattedDate = `${day}, ${monthName} ${year}`;
  
  return formattedDate;
}

// Example usage
console.log(getFormattedDate()); // Outputs: "4, July 2024" if today's date is July 4, 2024
