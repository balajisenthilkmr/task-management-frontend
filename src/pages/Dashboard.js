import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { taskAPI } from '../services/api';
import {
  Container,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  AppBar,
  Toolbar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  ExitToApp as LogoutIcon,
} from '@mui/icons-material';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editTask, setEditTask] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await taskAPI.getTasks();
      setTasks(response.data);
      setError('');
    } catch (error) {
      setError('Failed to fetch tasks');
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      const response = await taskAPI.createTask(newTask);
      setTasks([...tasks, response.data]);
      setNewTask('');
      setError('');
    } catch (error) {
      setError('Failed to add task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskAPI.deleteTask(taskId);
      setTasks(tasks.filter((task) => task._id !== taskId));
      setError('');
    } catch (error) {
      setError('Failed to delete task');
    }
  };

  const handleStatusChange = async (task, newStatus) => {
    try {
      const response = await taskAPI.updateTask(task._id, {
        ...task,
        status: newStatus,
      });
      setTasks(tasks.map((t) => (t._id === task._id ? response.data : t)));
      setError('');
    } catch (error) {
      setError('Failed to update task');
    }
  };

  const handleEditTask = async () => {
    if (!editTask || !editTask.title.trim()) return;

    try {
      const response = await taskAPI.updateTask(editTask._id, {
        title: editTask.title,
      });
      setTasks(tasks.map((task) => (task._id === editTask._id ? response.data : task)));
      setEditTask(null);
      setError('');
    } catch (error) {
      setError('Failed to update task');
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Task Management
          </Typography>
          <Typography variant="subtitle1" sx={{ mr: 2 }}>
            Welcome, {user?.name}
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Paper sx={{ p: 2, mb: 2 }}>
          <Box component="form" onSubmit={handleAddTask} sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a new task"
            />
            <Button type="submit" variant="contained">
              Add Task
            </Button>
          </Box>
        </Paper>

        <Paper>
          <List>
            {tasks.map((task) => (
              <ListItem
                key={task._id}
                sx={{
                  borderBottom: '1px solid #eee',
                  '&:last-child': { borderBottom: 'none' },
                }}
              >
                <ListItemText
                  primary={task.title}
                  secondary={`Created: ${new Date(task.createdAt).toLocaleDateString()}`}
                />
                <Box sx={{ minWidth: 120, mr: 2 }}>
                  <FormControl fullWidth size="small">
                    <Select
                      value={task.status || 'pending'}
                      onChange={(e) => handleStatusChange(task, e.target.value)}
                    >
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="in-progress">In Progress</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => setEditTask(task)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteTask(task._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>

        <Dialog open={Boolean(editTask)} onClose={() => setEditTask(null)}>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              value={editTask?.title || ''}
              onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditTask(null)}>Cancel</Button>
            <Button onClick={handleEditTask} variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Dashboard; 