import bcrypt from "bcryptjs";
import generateToken from "../../utils/createJwtToken.js";
import { pool } from "../../config/dbConfig.js";

// Register Lab Technician
export const registerLabTechnician = async (req, res) => {
  const { name, contactNo, password } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into Lab_Technician table
    const result = await pool.query(
      `INSERT INTO Lab_Technician (Name, Contact_No, Password) 
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, contactNo, hashedPassword]
    );

    const labTech = result.rows[0];
    const token = generateToken(labTech);

    res.status(201).json({
      message: "Lab Technician registered successfully",
      token,
      labTechnician: labTech,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error registering lab technician" });
  }
};

// Login Lab Technician
export const loginLabTechnician = async (req, res) => {
  const { contactNo, password } = req.body;

  try {
    const userRes = await pool.query(
      "SELECT * FROM Lab_Technician WHERE Contact_No = $1",
      [contactNo]
    );

    if (userRes.rows.length === 0)
      return res.status(401).json({ message: "Invalid credentials" });

    const labTech = userRes.rows[0];

    const validPassword = await bcrypt.compare(password, labTech.password);
    if (!validPassword)
      return res.status(401).json({ message: "Invalid password" });

    const token = generateToken(labTech);
    res.status(200).json({ message: "Login successful", token, labTechnician: labTech });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error logging in" });
  }
};
