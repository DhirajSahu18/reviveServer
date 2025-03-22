
import xlsx from 'xlsx'
import Participant from '../model/participant.model.js';


const createParticipant = async (req, res) => {
    try {
      const body = req.body;
      const participant = new Participant(body);
      participant.save();
      res.status(201).json({ message: "New Participant Added", participant });
    } catch (error) {
      console.log("Participant creation Error", error?.message);
      res.status(500).json({ message: "Internal Server error" });
    }
  }

const bulkCreateParticipant = async (req, res) => {
    try {
      const body = req.body;
  
      // Assuming the 'excelFile' field in the request contains the Excel file
      if (!req.file || !req.file.buffer) {
        return res.status(400).json({ message: 'No files were uploaded or the file buffer is empty.' });
      }
  
      // The buffer is already provided by multer
      const excelFileData = req.file.buffer;
  
      // Load the Excel workbook directly from the buffer
      const workbook = xlsx.read(excelFileData, { type: 'buffer' });
  
      // Assuming there is only one sheet in the Excel file
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
  
      // Check if the sheet is empty
      if (!sheet || Object.keys(sheet).length === 0) {
        return res.status(400).json({ message: 'The Excel sheet is empty.' });
      }
  
      // Convert sheet data to JSON
      const jsonData = xlsx.utils.sheet_to_json(sheet);
  
      // Process each participant
      const participantData = [];
  
      for (const data of jsonData) {
        // Assuming 'Participant' model has a schema structure that matches the data in the Excel sheet
        const participant = new Participant(data);
        await participant.save();
        participantData.push(participant);
      }
  
      res.status(201).json({ message: 'Participants Added', participants: participantData });
    } catch (error) {
      console.error('Participant creation Error', error?.message);
      res.status(500).json({ message: 'Internal Server error' });
    }
  }

const getAllParticipants = async (req, res) => {
    try {
      const participants = await Participant.find({});
      if (participants?.length < 1) {
        return res.status(404).json({ message: "No participants found" });
      }
  
      res.status(200).json({ participants });
    } catch (error) {
      console.log("Error fetching participants", error?.message);
      res.status(500).json({ message: "Internal Server error" });
    }
  }

const deleteParticipant = async (req, res) => {
    try {
      const id = req.params.id;
      const participant = await Participant.findByIdAndDelete(id);
      if (!participant) {
          return res.status(404).json({ message: "Participant already deleted" });
      }
      res.status(200).json({ message: "Participant Deleted" , id});
    } catch (error) {
      console.log("Error Deleting Participant", error?.message);
      res.status(500).json({ message: "Internal Server error" });
    }
  }

export {deleteParticipant , createParticipant , bulkCreateParticipant , getAllParticipants}