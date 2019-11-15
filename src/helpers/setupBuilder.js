export default function setupBuilder(builder, handlerType) {
  builder.handlerType = handlerType;
  Object.freeze(builder);
  return builder;
}