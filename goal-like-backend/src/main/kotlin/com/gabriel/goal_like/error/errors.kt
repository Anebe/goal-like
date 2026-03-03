package com.gabriel.goal_like.error

class UnauthorizedException(
    message: String = "Unauthorized"
) : RuntimeException(message)

class OperationNotAllowedException(
    message: String
) : IllegalStateException(message)

class BusinessRuleException(
    message: String
) : IllegalStateException(message)

class ResourceAlreadyExistsException(
    resource: String,
    field: String,
    value: Any
) : IllegalStateException("$resource with $field '$value' already exists")

class ResourceNotFoundException(
    resource: String,
    id: Any
) : NullPointerException("$resource with id $id not found")