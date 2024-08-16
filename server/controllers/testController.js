/* Author: Bhishman Desai */
/* GET: /api/health */
export async function testController(req, res) {
    return res.status(201).send({"message": "Health route working fine!"});
}