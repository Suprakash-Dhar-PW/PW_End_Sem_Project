const path = require('path');
const fs = require('fs');
const { PDFDocument } = require('pdf-lib');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const db = require('../database/db');

// Configure multer for PDF uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads/pdfs');
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Generate unique filename
        const uniqueName = `${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

// Filter only PDF files
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Initialize database tables
const initDatabase = () => {
    // Create PDFs table if not exists
    db.run(`
        CREATE TABLE IF NOT EXISTS pdfs (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            filename TEXT NOT NULL,
            size INTEGER NOT NULL,
            category TEXT,
            uploadedBy TEXT NOT NULL,
            uploadDate TEXT NOT NULL,
            url TEXT NOT NULL
        )
    `);
    
    // Create student activities table if not exists
    db.run(`
        CREATE TABLE IF NOT EXISTS student_activities (
            id TEXT PRIMARY KEY,
            student TEXT NOT NULL,
            type TEXT NOT NULL,
            pdfId TEXT,
            pdfName TEXT,
            timestamp TEXT NOT NULL,
            FOREIGN KEY (pdfId) REFERENCES pdfs (id) ON DELETE SET NULL
        )
    `);
};

// Initialize database on module load
initDatabase();

// Upload PDFs
exports.uploadPDFs = (req, res) => {
    // Use multer upload middleware
    const uploadMiddleware = upload.array('pdfs', 10); // Max 10 files
    
    uploadMiddleware(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        
        try {
            const uploadedFiles = req.files;
            const uploadedBy = req.body.uploadedBy || 'anonymous';
            
            if (!uploadedFiles || uploadedFiles.length === 0) {
                return res.status(400).json({ error: 'No files uploaded' });
            }
            
            const uploadedPdfs = [];
            
            // Process each uploaded file
            for (const file of uploadedFiles) {
                // Check if PDF with same name already exists
                const existingPdf = await new Promise((resolve, reject) => {
                    db.get('SELECT * FROM pdfs WHERE name = ?', [file.originalname], (err, row) => {
                        if (err) reject(err);
                        resolve(row);
                    });
                });
                
                if (existingPdf) {
                    // Delete the uploaded file
                    fs.unlinkSync(file.path);
                    continue; // Skip this file
                }
                
                // Generate PDF data
                const pdfId = uuidv4();
                const pdfUrl = `/uploads/pdfs/${file.filename}`;
                
                // Insert PDF into database
                await new Promise((resolve, reject) => {
                    db.run(
                        'INSERT INTO pdfs (id, name, filename, size, category, uploadedBy, uploadDate, url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                        [pdfId, file.originalname, file.filename, file.size, 'General', uploadedBy, new Date().toISOString(), pdfUrl],
                        (err) => {
                            if (err) reject(err);
                            resolve();
                        }
                    );
                });
                
                uploadedPdfs.push({
                    id: pdfId,
                    name: file.originalname,
                    size: file.size,
                    url: pdfUrl
                });
            }
            
            res.status(200).json({
                message: 'PDFs uploaded successfully',
                uploadedCount: uploadedPdfs.length,
                pdfs: uploadedPdfs
            });
            
        } catch (error) {
            console.error('Error uploading PDFs:', error);
            res.status(500).json({ error: 'Failed to upload PDFs' });
        }
    });
};

// Get all PDFs
exports.getAllPDFs = (req, res) => {
    try {
        db.all('SELECT * FROM pdfs ORDER BY uploadDate DESC', [], (err, rows) => {
            if (err) {
                console.error('Error getting PDFs:', err);
                return res.status(500).json({ error: 'Failed to get PDFs' });
            }
            
            res.status(200).json({ pdfs: rows });
        });
    } catch (error) {
        console.error('Error getting PDFs:', error);
        res.status(500).json({ error: 'Failed to get PDFs' });
    }
};

// Get PDF by ID
exports.getPDFById = (req, res) => {
    try {
        const { id } = req.params;
        
        db.get('SELECT * FROM pdfs WHERE id = ?', [id], (err, row) => {
            if (err) {
                console.error('Error getting PDF:', err);
                return res.status(500).json({ error: 'Failed to get PDF' });
            }
            
            if (!row) {
                return res.status(404).json({ error: 'PDF not found' });
            }
            
            res.status(200).json({ pdf: row });
        });
    } catch (error) {
        console.error('Error getting PDF:', error);
        res.status(500).json({ error: 'Failed to get PDF' });
    }
};

// Delete PDF
exports.deletePDF = (req, res) => {
    try {
        const { id } = req.params;
        
        // Get PDF info
        db.get('SELECT * FROM pdfs WHERE id = ?', [id], (err, row) => {
            if (err) {
                console.error('Error getting PDF:', err);
                return res.status(500).json({ error: 'Failed to delete PDF' });
            }
            
            if (!row) {
                return res.status(404).json({ error: 'PDF not found' });
            }
            
            // Delete file from filesystem
            const filePath = path.join(__dirname, '../uploads/pdfs', row.filename);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            
            // Delete from database
            db.run('DELETE FROM pdfs WHERE id = ?', [id], (err) => {
                if (err) {
                    console.error('Error deleting PDF:', err);
                    return res.status(500).json({ error: 'Failed to delete PDF' });
                }
                
                res.status(200).json({ message: 'PDF deleted successfully' });
            });
        });
    } catch (error) {
        console.error('Error deleting PDF:', error);
        res.status(500).json({ error: 'Failed to delete PDF' });
    }
};

// Merge PDFs
exports.mergePDFs = async (req, res) => {
    try {
        const { pdfIds, mergedName, uploadedBy } = req.body;
        
        if (!pdfIds || !Array.isArray(pdfIds) || pdfIds.length < 2) {
            return res.status(400).json({ error: 'At least 2 PDF IDs are required' });
        }
        
        if (!mergedName) {
            return res.status(400).json({ error: 'Merged PDF name is required' });
        }
        
        // Get PDFs from database
        const pdfs = await new Promise((resolve, reject) => {
            const placeholders = pdfIds.map(() => '?').join(',');
            db.all(`SELECT * FROM pdfs WHERE id IN (${placeholders})`, pdfIds, (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
        
        if (pdfs.length !== pdfIds.length) {
            return res.status(400).json({ error: 'One or more PDFs not found' });
        }
        
        // Create new PDF document
        const mergedPdf = await PDFDocument.create();
        
        // Add pages from each PDF
        for (const pdf of pdfs) {
            const filePath = path.join(__dirname, '..', pdf.url);
            const pdfBytes = fs.readFileSync(filePath);
            const pdfDoc = await PDFDocument.load(pdfBytes);
            const pages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
            
            // Add each page to the merged PDF
            pages.forEach(page => mergedPdf.addPage(page));
        }
        
        // Save merged PDF
        const mergedPdfBytes = await mergedPdf.save();
        
        // Generate unique filename
        const mergedFilename = `${Date.now()}-${uuidv4()}.pdf`;
        const mergedFilePath = path.join(__dirname, '../uploads/pdfs', mergedFilename);
        
        // Write merged PDF to file
        fs.writeFileSync(mergedFilePath, mergedPdfBytes);
        
        // Generate PDF data
        const mergedPdfId = uuidv4();
        const mergedPdfUrl = `/uploads/pdfs/${mergedFilename}`;
        const mergedPdfSize = fs.statSync(mergedFilePath).size;
        
        // Insert merged PDF into database
        await new Promise((resolve, reject) => {
            db.run(
                'INSERT INTO pdfs (id, name, filename, size, category, uploadedBy, uploadDate, url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [mergedPdfId, mergedName, mergedFilename, mergedPdfSize, 'Merged', uploadedBy, new Date().toISOString(), mergedPdfUrl],
                (err) => {
                    if (err) reject(err);
                    resolve();
                }
            );
        });
        
        res.status(200).json({
            message: 'PDFs merged successfully',
            mergedPdfId: mergedPdfId,
            mergedPdfUrl: mergedPdfUrl
        });
        
    } catch (error) {
        console.error('Error merging PDFs:', error);
        res.status(500).json({ error: 'Failed to merge PDFs' });
    }
};

// Create card from QR code
exports.createQRCard = (req, res) => {
    try {
        const { name, qrData, uploadedBy } = req.body;
        
        if (!name || !qrData) {
            return res.status(400).json({ error: 'Name and QR data are required' });
        }
        
        // Generate card ID
        const cardId = uuidv4();
        
        // Insert card into database
        db.run(
            'INSERT INTO pdfs (id, name, filename, size, category, uploadedBy, uploadDate, url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [cardId, name, 'qr-card', 0, 'QR Card', uploadedBy, new Date().toISOString(), qrData],
            (err) => {
                if (err) {
                    console.error('Error creating QR card:', err);
                    return res.status(500).json({ error: 'Failed to create QR card' });
                }
                
                res.status(200).json({
                    message: 'QR card created successfully',
                    cardId: cardId
                });
            }
        );
        
    } catch (error) {
        console.error('Error creating QR card:', error);
        res.status(500).json({ error: 'Failed to create QR card' });
    }
};

// Log student activity
exports.logActivity = (req, res) => {
    try {
        const { student, type, pdfId, pdfName } = req.body;
        
        if (!student || !type) {
            return res.status(400).json({ error: 'Student and activity type are required' });
        }
        
        // Generate activity ID
        const activityId = uuidv4();
        
        // Insert activity into database
        db.run(
            'INSERT INTO student_activities (id, student, type, pdfId, pdfName, timestamp) VALUES (?, ?, ?, ?, ?, ?)',
            [activityId, student, type, pdfId || null, pdfName || null, new Date().toISOString()],
            (err) => {
                if (err) {
                    console.error('Error logging activity:', err);
                    return res.status(500).json({ error: 'Failed to log activity' });
                }
                
                res.status(200).json({
                    message: 'Activity logged successfully',
                    activityId: activityId
                });
            }
        );
        
    } catch (error) {
        console.error('Error logging activity:', error);
        res.status(500).json({ error: 'Failed to log activity' });
    }
};

// Get all student activities
exports.getAllActivities = (req, res) => {
    try {
        db.all('SELECT * FROM student_activities ORDER BY timestamp DESC', [], (err, rows) => {
            if (err) {
                console.error('Error getting activities:', err);
                return res.status(500).json({ error: 'Failed to get activities' });
            }
            
            res.status(200).json({ activities: rows });
        });
    } catch (error) {
        console.error('Error getting activities:', error);
        res.status(500).json({ error: 'Failed to get activities' });
    }
};