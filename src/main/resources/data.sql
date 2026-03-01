INSERT INTO content_creator (id, full_name)
VALUES ('550e8400-e29b-41d4-a716-446655440001',
        'João Silva'),
       ('550e8400-e29b-41d4-a716-446655440002',
        'Gabriel aaaa');
INSERT INTO contact (contact, type, content_creator_id)
VALUES ('joao@email.com',
        'EMAIL',
        '550e8400-e29b-41d4-a716-446655440001'),
       ('11999999999',
        'SMS',
        '550e8400-e29b-41d4-a716-446655440002'),
       ('um contato qualquer',
        'MOCK',
        '550e8400-e29b-41d4-a716-446655440001');
INSERT INTO goal_entity (id,
                  name,
                  description,
                  video_id,
                  status,
                  channel,
                  content_creator_id)
VALUES ('550e8400-e29b-41d4-a716-446655440000',
        'Meta de Likes',
        'Meta para alcançar 1000 likes no vídeo',
        '5Rf0FZD2iPI',
        'ACTIVE',
        'MOCK',
        '550e8400-e29b-41d4-a716-446655440001');
INSERT INTO target_entity (amount, type, goal_id, status)
VALUES ('1000',
        'GOAL_DESIRE',
        '550e8400-e29b-41d4-a716-446655440000',
        'ACTIVE');

