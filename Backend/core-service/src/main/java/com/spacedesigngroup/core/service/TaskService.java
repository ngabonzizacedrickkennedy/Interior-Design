package com.spacedesigngroup.core.service;

import com.spacedesigngroup.core.auth.User;
import com.spacedesigngroup.core.auth.UserRepository;
import com.spacedesigngroup.core.common.exception.ResourceNotFoundException;
import com.spacedesigngroup.core.dto.TaskRequest;
import com.spacedesigngroup.core.dto.TaskResponse;
import com.spacedesigngroup.core.model.TaskAssignment;
import com.spacedesigngroup.core.repository.ProjectRepository;
import com.spacedesigngroup.core.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public List<TaskResponse> findAll() {
        return taskRepository.findAll().stream().map(this::toResponse).toList();
    }

    public List<TaskResponse> findByProject(Long projectId) {
        return taskRepository.findByProjectId(projectId).stream().map(this::toResponse).toList();
    }

    public List<TaskResponse> findByDesigner(Long designerId) {
        return taskRepository.findByAssignedDesignerId(designerId).stream().map(this::toResponse).toList();
    }

    public List<TaskResponse> findOverdue() {
        return taskRepository.findByIsCompletedFalseAndDeadlineDateBefore(LocalDate.now())
                .stream().map(this::toResponse).toList();
    }

    public TaskResponse findById(Long id) {
        return toResponse(getOrThrow(id));
    }

    public TaskResponse create(TaskRequest request) {
        var project = projectRepository.findById(request.projectId())
                .orElseThrow(() -> ResourceNotFoundException.forEntity("ProjectRecord", request.projectId()));
        User designer = null;
        if (request.assignedDesignerId() != null) {
            designer = userRepository.findById(request.assignedDesignerId())
                    .orElseThrow(() -> ResourceNotFoundException.forEntity("User", request.assignedDesignerId()));
        }
        TaskAssignment task = TaskAssignment.builder()
                .project(project)
                .taskTitle(request.taskTitle())
                .assignedDesigner(designer)
                .deadlineDate(request.deadlineDate())
                .isCompleted(false)
                .build();
        return toResponse(taskRepository.save(task));
    }

    public TaskResponse toggleCompletion(Long id) {
        TaskAssignment task = getOrThrow(id);
        task.setIsCompleted(!task.getIsCompleted());
        return toResponse(taskRepository.save(task));
    }

    public void delete(Long id) {
        taskRepository.delete(getOrThrow(id));
    }

    private TaskAssignment getOrThrow(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.forEntity("TaskAssignment", id));
    }

    private TaskResponse toResponse(TaskAssignment t) {
        return new TaskResponse(
                t.getId(), t.getProject().getId(), t.getTaskTitle(),
                t.getAssignedDesigner() != null ? t.getAssignedDesigner().getId() : null,
                t.getAssignedDesigner() != null ? t.getAssignedDesigner().getFullName() : null,
                t.getDeadlineDate(), t.getIsCompleted()
        );
    }
}
