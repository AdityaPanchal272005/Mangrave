const PORT = process.env.PORT || 10000;  // Render sets PORT
app.listen(PORT, '0.0.0.0', () => {
  console.log('Server on', PORT);
});